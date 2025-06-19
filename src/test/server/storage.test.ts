import { describe, it, expect, beforeEach } from 'vitest';
import { MemStorage } from '../../server/storage';
import type { InsertUser, InsertProject, InsertContact } from '../../shared/schema';

describe('MemStorage', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  describe('User Management', () => {
    it('should create and retrieve a user', async () => {
      const userData: InsertUser = {
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'employee',
        companyId: 1,
        password: 'hashedpassword123'
      };

      const createdUser = await storage.createUser(userData);
      expect(createdUser).toMatchObject({
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'employee',
        companyId: 1
      });
      expect(createdUser.id).toBeDefined();
      expect(createdUser.createdAt).toBeDefined();

      const retrievedUser = await storage.getUser(createdUser.id);
      expect(retrievedUser).toEqual(createdUser);
    });

    it('should retrieve user by username', async () => {
      const userData: InsertUser = {
        username: 'uniqueuser',
        email: 'unique@example.com',
        firstName: 'Unique',
        lastName: 'User',
        role: 'admin',
        companyId: 1,
        password: 'hashedpassword123'
      };

      const createdUser = await storage.createUser(userData);
      const foundUser = await storage.getUserByUsername('uniqueuser');
      expect(foundUser).toEqual(createdUser);
    });

    it('should retrieve user by email', async () => {
      const userData: InsertUser = {
        username: 'emailuser',
        email: 'unique@test.com',
        firstName: 'Email',
        lastName: 'User',
        role: 'employee',
        companyId: 1,
        password: 'hashedpassword123'
      };

      const createdUser = await storage.createUser(userData);
      const foundUser = await storage.getUserByEmail('unique@test.com');
      expect(foundUser).toEqual(createdUser);
    });

    it('should update user information', async () => {
      const userData: InsertUser = {
        username: 'updateuser',
        email: 'update@example.com',
        firstName: 'Update',
        lastName: 'User',
        role: 'employee',
        companyId: 1,
        password: 'hashedpassword123'
      };

      const createdUser = await storage.createUser(userData);
      const updatedUser = await storage.updateUser(createdUser.id, {
        firstName: 'Updated',
        role: 'admin'
      });

      expect(updatedUser).toMatchObject({
        firstName: 'Updated',
        role: 'admin',
        lastName: 'User' // Should remain unchanged
      });
    });

    it('should return users by company', async () => {
      const user1: InsertUser = {
        username: 'user1',
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
        role: 'employee',
        companyId: 1,
        password: 'hashedpassword123'
      };

      const user2: InsertUser = {
        username: 'user2',
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
        role: 'employee',
        companyId: 1,
        password: 'hashedpassword123'
      };

      const user3: InsertUser = {
        username: 'user3',
        email: 'user3@example.com',
        firstName: 'User',
        lastName: 'Three',
        role: 'employee',
        companyId: 2,
        password: 'hashedpassword123'
      };

      await storage.createUser(user1);
      await storage.createUser(user2);
      await storage.createUser(user3);

      const company1Users = await storage.getUsersByCompany(1);
      expect(company1Users).toHaveLength(4); // 2 created + 2 from test data

      const company2Users = await storage.getUsersByCompany(2);
      expect(company2Users).toHaveLength(1);
    });
  });

  describe('Project Management', () => {
    it('should create and retrieve a project', async () => {
      const projectData: InsertProject = {
        name: 'Test Project',
        description: 'A test project',
        address: '123 Test St',
        status: 'active',
        companyId: 1,
        clientId: 2,
        budgetTotal: '10000.00'
      };

      const createdProject = await storage.createProject(projectData);
      expect(createdProject).toMatchObject(projectData);
      expect(createdProject.id).toBeDefined();
      expect(createdProject.createdAt).toBeDefined();

      const retrievedProject = await storage.getProject(createdProject.id);
      expect(retrievedProject).toEqual(createdProject);
    });

    it('should return projects by company', async () => {
      const project1: InsertProject = {
        name: 'Company 1 Project 1',
        companyId: 1,
        clientId: 2,
        status: 'active'
      };

      const project2: InsertProject = {
        name: 'Company 1 Project 2',
        companyId: 1,
        clientId: 2,
        status: 'completed'
      };

      const project3: InsertProject = {
        name: 'Company 2 Project 1',
        companyId: 2,
        clientId: 3,
        status: 'active'
      };

      await storage.createProject(project1);
      await storage.createProject(project2);
      await storage.createProject(project3);

      const company1Projects = await storage.getProjectsByCompany(1);
      expect(company1Projects).toHaveLength(4); // 2 created + 2 from test data

      const company2Projects = await storage.getProjectsByCompany(2);
      expect(company2Projects).toHaveLength(1);
    });

    it('should return projects by client', async () => {
      const project1: InsertProject = {
        name: 'Client 2 Project 1',
        companyId: 1,
        clientId: 2,
        status: 'active'
      };

      const project2: InsertProject = {
        name: 'Client 2 Project 2',
        companyId: 1,
        clientId: 2,
        status: 'planning'
      };

      const project3: InsertProject = {
        name: 'Client 3 Project 1',
        companyId: 1,
        clientId: 3,
        status: 'active'
      };

      await storage.createProject(project1);
      await storage.createProject(project2);
      await storage.createProject(project3);

      const client2Projects = await storage.getProjectsByClient(2);
      expect(client2Projects).toHaveLength(4); // 2 created + 2 from test data

      const client3Projects = await storage.getProjectsByClient(3);
      expect(client3Projects).toHaveLength(1);
    });

    it('should update project information', async () => {
      const projectData: InsertProject = {
        name: 'Update Test Project',
        companyId: 1,
        clientId: 2,
        status: 'planning',
        budgetTotal: '5000.00'
      };

      const createdProject = await storage.createProject(projectData);
      const updatedProject = await storage.updateProject(createdProject.id, {
        status: 'active',
        budgetTotal: '7500.00'
      });

      expect(updatedProject).toMatchObject({
        status: 'active',
        budgetTotal: '7500.00',
        name: 'Update Test Project' // Should remain unchanged
      });
    });

    it('should delete a project', async () => {
      const projectData: InsertProject = {
        name: 'Delete Test Project',
        companyId: 1,
        clientId: 2,
        status: 'planning'
      };

      const createdProject = await storage.createProject(projectData);
      const deleteResult = await storage.deleteProject(createdProject.id);
      expect(deleteResult).toBe(true);

      const retrievedProject = await storage.getProject(createdProject.id);
      expect(retrievedProject).toBeUndefined();
    });
  });

  describe('Contact Management', () => {
    it('should create and retrieve a contact', async () => {
      const contactData: InsertContact = {
        type: 'client',
        firstName: 'John',
        lastName: 'Client',
        email: 'john@client.com',
        phone: '+1234567890',
        company: 'Client Co',
        companyId: 1
      };

      const createdContact = await storage.createContact(contactData);
      expect(createdContact).toMatchObject(contactData);
      expect(createdContact.id).toBeDefined();
      expect(createdContact.createdAt).toBeDefined();

      const retrievedContact = await storage.getContact(createdContact.id);
      expect(retrievedContact).toEqual(createdContact);
    });

    it('should return contacts by company', async () => {
      const contact1: InsertContact = {
        type: 'client',
        firstName: 'Client',
        lastName: 'One',
        companyId: 1
      };

      const contact2: InsertContact = {
        type: 'subcontractor',
        firstName: 'Sub',
        lastName: 'Contractor',
        companyId: 1
      };

      const contact3: InsertContact = {
        type: 'client',
        firstName: 'Other',
        lastName: 'Client',
        companyId: 2
      };

      await storage.createContact(contact1);
      await storage.createContact(contact2);
      await storage.createContact(contact3);

      const company1Contacts = await storage.getContactsByCompany(1);
      expect(company1Contacts.length).toBeGreaterThanOrEqual(2);

      const company2Contacts = await storage.getContactsByCompany(2);
      expect(company2Contacts).toHaveLength(1);
    });

    it('should return contacts by type', async () => {
      const client1: InsertContact = {
        type: 'client',
        firstName: 'Client',
        lastName: 'Alpha',
        companyId: 1
      };

      const client2: InsertContact = {
        type: 'client',
        firstName: 'Client',
        lastName: 'Beta',
        companyId: 1
      };

      const subcontractor: InsertContact = {
        type: 'subcontractor',
        firstName: 'Sub',
        lastName: 'Alpha',
        companyId: 1
      };

      await storage.createContact(client1);
      await storage.createContact(client2);
      await storage.createContact(subcontractor);

      const clients = await storage.getContactsByType(1, 'client');
      expect(clients.length).toBeGreaterThanOrEqual(2);

      const subcontractors = await storage.getContactsByType(1, 'subcontractor');
      expect(subcontractors).toHaveLength(1);
    });

    it('should update contact information', async () => {
      const contactData: InsertContact = {
        type: 'client',
        firstName: 'Update',
        lastName: 'Test',
        email: 'old@email.com',
        companyId: 1
      };

      const createdContact = await storage.createContact(contactData);
      const updatedContact = await storage.updateContact(createdContact.id, {
        email: 'new@email.com',
        phone: '+1234567890'
      });

      expect(updatedContact).toMatchObject({
        email: 'new@email.com',
        phone: '+1234567890',
        firstName: 'Update' // Should remain unchanged
      });
    });

    it('should delete a contact', async () => {
      const contactData: InsertContact = {
        type: 'vendor',
        firstName: 'Delete',
        lastName: 'Test',
        companyId: 1
      };

      const createdContact = await storage.createContact(contactData);
      const deleteResult = await storage.deleteContact(createdContact.id);
      expect(deleteResult).toBe(true);

      const retrievedContact = await storage.getContact(createdContact.id);
      expect(retrievedContact).toBeUndefined();
    });
  });
});