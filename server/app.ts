import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { setupMonitoring } from "./monitoring";
import { setupDocs } from "./docs";
import { type Server } from "http";

export async function createApp(options: { 
  isDevelopment?: boolean, 
  setupViteMiddleware?: boolean 
} = {}) {
  const { isDevelopment = true, setupViteMiddleware = true } = options;
  
  const app = express();

  // Initialize monitoring (must be first)
  const monitoring = setupMonitoring(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        // Only log in development or when not in test mode
        if (process.env.NODE_ENV !== 'test') {
          log(logLine);
        }
      }
    });

    next();
  });

  const server = await registerRoutes(app);

  // Setup API documentation
  if (process.env.NODE_ENV !== 'test') {
    setupDocs(app);
  }

  // Setup Vite middleware only in development and when requested
  if (isDevelopment && setupViteMiddleware && app.get("env") === "development") {
    await setupVite(app, server);
  } else if (!setupViteMiddleware && process.env.NODE_ENV !== 'test') {
    // For production or when Vite is not needed (but not in test environment)
    serveStatic(app);
  }

  // Sentry error handler (must be before other error handlers)
  app.use(monitoring.errorHandler);

  // Error handling middleware
  app.use(errorHandler);
  
  // 404 handler for unmatched routes (last)
  app.use(notFoundHandler);

  return { app, server };
}