import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { 
  loginSchema, insertUserSchema, insertProjectSchema, insertProjectTaskSchema,
  insertCostCategorySchema, insertChangeOrderSchema, insertDailyLogSchema,
  insertDocumentSchema, insertContactSchema, insertNotificationSchema,
  type AuthUser
} from "@shared/schema";
import { ZodError } from "zod";

// Simple session storage (in production, use Redis or database)
const sessions = new Map<string, { userId: number; expires: Date }>();

// Generate session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: Function) {
  const sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const session = sessions.get(sessionId);
  if (!session || session.expires < new Date()) {
    sessions.delete(sessionId);
    return res.status(401).json({ message: "Session expired" });
  }

  (req as any).userId = session.userId;
  next();
}

// Role-based authorization middleware
function requireRole(roles: string[]) {
  return async (req: Request, res: Response, next: Function) => {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    (req as any).user = user;
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }

      // Create session
      const sessionId = generateSessionId();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      sessions.set(sessionId, { userId: user.id, expires });

      const authUser: AuthUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
      };

      // Set secure HTTP-only cookie
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.json(authUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", requireAuth, async (req: Request, res: Response) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    
    // Clear the cookie
    res.clearCookie('sessionId');
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const authUser: AuthUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
      };

      res.json(authUser);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Projects routes
  app.get("/api/projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req as any).userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      let projects;
      if (user.role === 'client') {
        projects = await storage.getProjectsByClient(user.id);
      } else if (user.companyId) {
        projects = await storage.getProjectsByCompany(user.companyId);
      } else {
        projects = [];
      }

      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check access permissions
      const user = await storage.getUser((req as any).userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const hasAccess = user.role === 'admin' || 
                       (user.role === 'client' && project.clientId === user.id) ||
                       (user.companyId && project.companyId === user.companyId);

      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects", 
    requireAuth, 
    requireRole(['admin', 'employee']), 
    async (req: Request, res: Response) => {
      try {
        const user = (req as any).user;
        const projectData = insertProjectSchema.parse({
          ...req.body,
          companyId: user.companyId
        });
        
        const project = await storage.createProject(projectData);
        res.json(project);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.put("/api/projects/:id", 
    requireAuth, 
    requireRole(['admin', 'employee']), 
    async (req: Request, res: Response) => {
      try {
        const projectId = parseInt(req.params.id);
        const projectData = insertProjectSchema.partial().parse(req.body);
        
        const project = await storage.updateProject(projectId, projectData);
        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }
        
        res.json(project);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Project Tasks routes
  app.get("/api/projects/:projectId/tasks", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const tasks = await storage.getTasksByProject(projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/tasks", 
    requireAuth, 
    requireRole(['admin', 'employee']), 
    async (req: Request, res: Response) => {
      try {
        const projectId = parseInt(req.params.projectId);
        const taskData = insertProjectTaskSchema.parse({
          ...req.body,
          projectId
        });
        
        const task = await storage.createProjectTask(taskData);
        res.json(task);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.put("/api/tasks/:id", 
    requireAuth, 
    requireRole(['admin', 'employee']), 
    async (req: Request, res: Response) => {
      try {
        const taskId = parseInt(req.params.id);
        const taskData = insertProjectTaskSchema.partial().parse(req.body);
        
        const task = await storage.updateProjectTask(taskId, taskData);
        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }
        
        res.json(task);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Cost Categories routes
  app.get("/api/projects/:projectId/costs", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const costs = await storage.getCostCategoriesByProject(projectId);
      res.json(costs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/costs", 
    requireAuth, 
    requireRole(['admin', 'employee']), 
    async (req: Request, res: Response) => {
      try {
        const projectId = parseInt(req.params.projectId);
        const costData = insertCostCategorySchema.parse({
          ...req.body,
          projectId
        });
        
        const cost = await storage.createCostCategory(costData);
        res.json(cost);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Change Orders routes
  app.get("/api/projects/:projectId/change-orders", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const changeOrders = await storage.getChangeOrdersByProject(projectId);
      res.json(changeOrders);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/change-orders", 
    requireAuth, 
    requireRole(['admin', 'employee']), 
    async (req: Request, res: Response) => {
      try {
        const projectId = parseInt(req.params.projectId);
        const userId = (req as any).userId;
        const orderData = insertChangeOrderSchema.parse({
          ...req.body,
          projectId,
          createdBy: userId
        });
        
        const order = await storage.createChangeOrder(orderData);
        res.json(order);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.put("/api/change-orders/:id/approve", 
    requireAuth, 
    async (req: Request, res: Response) => {
      try {
        const orderId = parseInt(req.params.id);
        const userId = (req as any).userId;
        
        const order = await storage.updateChangeOrder(orderId, {
          status: "approved",
          approvedBy: userId,
          approvedAt: new Date()
        });
        
        if (!order) {
          return res.status(404).json({ message: "Change order not found" });
        }
        
        res.json(order);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Daily Logs routes
  app.get("/api/projects/:projectId/daily-logs", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const logs = await storage.getDailyLogsByProject(projectId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/daily-logs", 
    requireAuth, 
    requireRole(['admin', 'employee']), 
    async (req: Request, res: Response) => {
      try {
        const projectId = parseInt(req.params.projectId);
        const userId = (req as any).userId;
        const logData = insertDailyLogSchema.parse({
          ...req.body,
          projectId,
          createdBy: userId
        });
        
        const log = await storage.createDailyLog(logData);
        res.json(log);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Documents routes
  app.get("/api/projects/:projectId/documents", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const documents = await storage.getDocumentsByProject(projectId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Contacts routes
  app.get("/api/contacts", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser((req as any).userId);
      if (!user || !user.companyId) {
        return res.status(404).json({ message: "User or company not found" });
      }

      const type = req.query.type as string;
      const contacts = type 
        ? await storage.getContactsByType(user.companyId, type)
        : await storage.getContactsByCompany(user.companyId);
      
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/contacts", 
    requireAuth, 
    requireRole(['admin', 'employee']), 
    async (req: Request, res: Response) => {
      try {
        const user = (req as any).user;
        const contactData = insertContactSchema.parse({
          ...req.body,
          companyId: user.companyId
        });
        
        const contact = await storage.createContact(contactData);
        res.json(contact);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Notifications routes
  app.get("/api/notifications", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/notifications/unread", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const notifications = await storage.getUnreadNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/notifications/:id/read", requireAuth, async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(notificationId);
      
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Let the frontend handle all non-API routes
  // This will be handled by the Vite dev server or static file serving

  const httpServer = createServer(app);
  return httpServer;
}
