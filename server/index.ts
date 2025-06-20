import { createApp } from "./app";
import { log } from "./vite";

// Export the app for testing
export default async function createAppForTesting() {
  const { app } = await createApp({ 
    isDevelopment: false, 
    setupViteMiddleware: false 
  });
  return app;
}

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    const { server } = await createApp({ 
      isDevelopment: true, 
      setupViteMiddleware: true 
    });

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  })();
}
