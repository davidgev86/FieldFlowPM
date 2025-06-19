import { 
  users, companies, projects, projectTasks, costCategories, changeOrders, 
  dailyLogs, documents, contacts, notifications,
  type User, type InsertUser, type Company, type InsertCompany,
  type Project, type InsertProject, type ProjectTask, type InsertProjectTask,
  type CostCategory, type InsertCostCategory, type ChangeOrder, type InsertChangeOrder,
  type DailyLog, type InsertDailyLog, type Document, type InsertDocument,
  type Contact, type InsertContact, type Notification, type InsertNotification,
  type AuthUser
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getUsersByCompany(companyId: number): Promise<User[]>;

  // Companies
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;

  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByCompany(companyId: number): Promise<Project[]>;
  getProjectsByClient(clientId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Project Tasks
  getProjectTask(id: number): Promise<ProjectTask | undefined>;
  getTasksByProject(projectId: number): Promise<ProjectTask[]>;
  createProjectTask(task: InsertProjectTask): Promise<ProjectTask>;
  updateProjectTask(id: number, task: Partial<InsertProjectTask>): Promise<ProjectTask | undefined>;
  deleteProjectTask(id: number): Promise<boolean>;

  // Cost Categories
  getCostCategory(id: number): Promise<CostCategory | undefined>;
  getCostCategoriesByProject(projectId: number): Promise<CostCategory[]>;
  createCostCategory(category: InsertCostCategory): Promise<CostCategory>;
  updateCostCategory(id: number, category: Partial<InsertCostCategory>): Promise<CostCategory | undefined>;
  deleteCostCategory(id: number): Promise<boolean>;

  // Change Orders
  getChangeOrder(id: number): Promise<ChangeOrder | undefined>;
  getChangeOrdersByProject(projectId: number): Promise<ChangeOrder[]>;
  createChangeOrder(order: InsertChangeOrder): Promise<ChangeOrder>;
  updateChangeOrder(id: number, order: Partial<InsertChangeOrder>): Promise<ChangeOrder | undefined>;
  deleteChangeOrder(id: number): Promise<boolean>;

  // Daily Logs
  getDailyLog(id: number): Promise<DailyLog | undefined>;
  getDailyLogsByProject(projectId: number): Promise<DailyLog[]>;
  createDailyLog(log: InsertDailyLog): Promise<DailyLog>;
  updateDailyLog(id: number, log: Partial<InsertDailyLog>): Promise<DailyLog | undefined>;
  deleteDailyLog(id: number): Promise<boolean>;

  // Documents
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByProject(projectId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;

  // Contacts
  getContact(id: number): Promise<Contact | undefined>;
  getContactsByCompany(companyId: number): Promise<Contact[]>;
  getContactsByType(companyId: number, type: string): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;

  // Notifications
  getNotification(id: number): Promise<Notification | undefined>;
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  getUnreadNotificationsByUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private companies: Map<number, Company> = new Map();
  private projects: Map<number, Project> = new Map();
  private projectTasks: Map<number, ProjectTask> = new Map();
  private costCategories: Map<number, CostCategory> = new Map();
  private changeOrders: Map<number, ChangeOrder> = new Map();
  private dailyLogs: Map<number, DailyLog> = new Map();
  private documents: Map<number, Document> = new Map();
  private contacts: Map<number, Contact> = new Map();
  private notifications: Map<number, Notification> = new Map();
  
  private currentId: number = 1;

  constructor() {
    this.initializeTestData();
  }

  private getNextId(): number {
    return this.currentId++;
  }

  private initializeTestData() {
    // Create test company
    const company: Company = {
      id: 1,
      name: "ABC Construction",
      address: "123 Main St, Springfield",
      phone: "(555) 123-4567",
      email: "info@abcconstruction.com",
      licenseNumber: "LIC123456",
      createdAt: new Date(),
    };
    this.companies.set(1, company);

    // Create test admin user
    const adminUser: User = {
      id: 1,
      username: "admin",
      email: "admin@abcconstruction.com",
      password: "$2b$10$rHH0OazfqRG0UGMNTLdAOOjCTCIwGZ7RbgqgWUjg4OKu8oN6.nTtW", // password: "admin123"
      firstName: "John",
      lastName: "Doe",
      role: "admin",
      companyId: 1,
      phone: "(555) 123-4567",
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(1, adminUser);

    // Create test client
    const clientUser: User = {
      id: 2,
      username: "maria.johnson",
      email: "maria@email.com",
      password: "$2b$10$rHH0OazfqRG0UGMNTLdAOOjCTCIwGZ7RbgqgWUjg4OKu8oN6.nTtW", // password: "client123"
      firstName: "Maria",
      lastName: "Johnson",
      role: "client",
      companyId: null,
      phone: "(555) 234-5678",
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(2, clientUser);

    // Create test projects
    const project1: Project = {
      id: 1,
      name: "Kitchen Remodel - Johnson Residence",
      description: "Complete kitchen renovation including cabinets, countertops, and appliances",
      address: "1234 Oak Street, Springfield",
      clientId: 2,
      companyId: 1,
      status: "active",
      budgetTotal: "25000.00",
      startDate: new Date("2024-03-15"),
      dueDate: new Date("2024-04-30"),
      endDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(1, project1);

    const project2: Project = {
      id: 2,
      name: "Bathroom Addition - Smith House",
      description: "New bathroom addition with modern fixtures",
      address: "567 Pine Avenue, Springfield",
      clientId: 2,
      companyId: 1,
      status: "active",
      budgetTotal: "20000.00",
      startDate: new Date("2024-02-28"),
      dueDate: new Date("2024-03-31"),
      endDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(2, project2);

    // Create test cost categories
    const costCat1: CostCategory = {
      id: 1,
      projectId: 1,
      name: "Materials",
      budgetAmount: "18000.00",
      actualAmount: "17450.00",
      category: "materials",
    };
    this.costCategories.set(1, costCat1);

    const costCat2: CostCategory = {
      id: 2,
      projectId: 1,
      name: "Labor",
      budgetAmount: "15000.00",
      actualAmount: "16200.00",
      category: "labor",
    };
    this.costCategories.set(2, costCat2);

    // Create test change order
    const changeOrder1: ChangeOrder = {
      id: 1,
      projectId: 1,
      title: "CO-001: Kitchen Island Addition",
      description: "Add kitchen island with granite countertop and electrical outlets",
      amount: "3200.00",
      status: "pending",
      createdBy: 1,
      approvedBy: null,
      approvedAt: null,
      signedAt: null,
      createdAt: new Date(),
    };
    this.changeOrders.set(1, changeOrder1);

    // Create test daily log
    const dailyLog1: DailyLog = {
      id: 1,
      projectId: 1,
      date: new Date(),
      weather: "Clear",
      temperature: "72°F",
      crew: ["Mike", "Steve", "Tom"],
      notes: "Completed electrical rough-in for kitchen outlets. All work passed inspection.",
      createdBy: 1,
      createdAt: new Date(),
    };
    this.dailyLogs.set(1, dailyLog1);

    this.currentId = 10; // Start IDs from 10 to avoid conflicts
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.getNextId();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsersByCompany(companyId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.companyId === companyId);
  }

  // Companies
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.getNextId();
    const company: Company = { 
      ...insertCompany, 
      id, 
      createdAt: new Date() 
    };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: number, updateData: Partial<InsertCompany>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;
    
    const updatedCompany: Company = { ...company, ...updateData };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByCompany(companyId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.companyId === companyId);
  }

  async getProjectsByClient(clientId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.clientId === clientId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.getNextId();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = { 
      ...project, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Project Tasks
  async getProjectTask(id: number): Promise<ProjectTask | undefined> {
    return this.projectTasks.get(id);
  }

  async getTasksByProject(projectId: number): Promise<ProjectTask[]> {
    return Array.from(this.projectTasks.values()).filter(task => task.projectId === projectId);
  }

  async createProjectTask(insertTask: InsertProjectTask): Promise<ProjectTask> {
    const id = this.getNextId();
    const task: ProjectTask = { 
      ...insertTask, 
      id, 
      createdAt: new Date() 
    };
    this.projectTasks.set(id, task);
    return task;
  }

  async updateProjectTask(id: number, updateData: Partial<InsertProjectTask>): Promise<ProjectTask | undefined> {
    const task = this.projectTasks.get(id);
    if (!task) return undefined;
    
    const updatedTask: ProjectTask = { ...task, ...updateData };
    this.projectTasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteProjectTask(id: number): Promise<boolean> {
    return this.projectTasks.delete(id);
  }

  // Cost Categories
  async getCostCategory(id: number): Promise<CostCategory | undefined> {
    return this.costCategories.get(id);
  }

  async getCostCategoriesByProject(projectId: number): Promise<CostCategory[]> {
    return Array.from(this.costCategories.values()).filter(cat => cat.projectId === projectId);
  }

  async createCostCategory(insertCategory: InsertCostCategory): Promise<CostCategory> {
    const id = this.getNextId();
    const category: CostCategory = { ...insertCategory, id };
    this.costCategories.set(id, category);
    return category;
  }

  async updateCostCategory(id: number, updateData: Partial<InsertCostCategory>): Promise<CostCategory | undefined> {
    const category = this.costCategories.get(id);
    if (!category) return undefined;
    
    const updatedCategory: CostCategory = { ...category, ...updateData };
    this.costCategories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCostCategory(id: number): Promise<boolean> {
    return this.costCategories.delete(id);
  }

  // Change Orders
  async getChangeOrder(id: number): Promise<ChangeOrder | undefined> {
    return this.changeOrders.get(id);
  }

  async getChangeOrdersByProject(projectId: number): Promise<ChangeOrder[]> {
    return Array.from(this.changeOrders.values()).filter(order => order.projectId === projectId);
  }

  async createChangeOrder(insertOrder: InsertChangeOrder): Promise<ChangeOrder> {
    const id = this.getNextId();
    const order: ChangeOrder = { 
      ...insertOrder, 
      id, 
      createdAt: new Date() 
    };
    this.changeOrders.set(id, order);
    return order;
  }

  async updateChangeOrder(id: number, updateData: Partial<InsertChangeOrder>): Promise<ChangeOrder | undefined> {
    const order = this.changeOrders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: ChangeOrder = { ...order, ...updateData };
    this.changeOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteChangeOrder(id: number): Promise<boolean> {
    return this.changeOrders.delete(id);
  }

  // Daily Logs
  async getDailyLog(id: number): Promise<DailyLog | undefined> {
    return this.dailyLogs.get(id);
  }

  async getDailyLogsByProject(projectId: number): Promise<DailyLog[]> {
    return Array.from(this.dailyLogs.values()).filter(log => log.projectId === projectId);
  }

  async createDailyLog(insertLog: InsertDailyLog): Promise<DailyLog> {
    const id = this.getNextId();
    const log: DailyLog = { 
      ...insertLog, 
      id, 
      createdAt: new Date() 
    };
    this.dailyLogs.set(id, log);
    return log;
  }

  async updateDailyLog(id: number, updateData: Partial<InsertDailyLog>): Promise<DailyLog | undefined> {
    const log = this.dailyLogs.get(id);
    if (!log) return undefined;
    
    const updatedLog: DailyLog = { ...log, ...updateData };
    this.dailyLogs.set(id, updatedLog);
    return updatedLog;
  }

  async deleteDailyLog(id: number): Promise<boolean> {
    return this.dailyLogs.delete(id);
  }

  // Documents
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByProject(projectId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.projectId === projectId);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.getNextId();
    const document: Document = { 
      ...insertDocument, 
      id, 
      createdAt: new Date() 
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument: Document = { ...document, ...updateData };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Contacts
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getContactsByCompany(companyId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.companyId === companyId);
  }

  async getContactsByType(companyId: number, type: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(
      contact => contact.companyId === companyId && contact.type === type
    );
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.getNextId();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: number, updateData: Partial<InsertContact>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    
    const updatedContact: Contact = { ...contact, ...updateData };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Notifications
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnreadNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.read)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.getNextId();
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      createdAt: new Date() 
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.read = true;
    this.notifications.set(id, notification);
    return true;
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.read);
    
    userNotifications.forEach(notification => {
      notification.read = true;
      this.notifications.set(notification.id, notification);
    });
    
    return true;
  }
}

export const storage = new MemStorage();
