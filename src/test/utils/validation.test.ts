import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { 
  loginSchema, 
  insertUserSchema, 
  insertProjectSchema,
  insertContactSchema 
} from '../../../shared/schema';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        username: 'testuser',
        password: 'password123'
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty username', () => {
      const invalidData = {
        username: '',
        password: 'password123'
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('username');
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        username: 'testuser',
        password: ''
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('password');
      }
    });

    it('should reject missing fields', () => {
      const invalidData = {};

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toHaveLength(2);
      }
    });
  });

  describe('insertUserSchema', () => {
    it('should validate valid user data', () => {
      const validData = {
        username: 'johndoe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'employee',
        companyId: 1,
        password: 'securepassword123'
      };

      const result = insertUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        username: 'johndoe',
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        role: 'employee',
        companyId: 1,
        password: 'securepassword123'
      };

      const result = insertUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid role', () => {
      const invalidData = {
        username: 'johndoe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'invalid-role',
        companyId: 1,
        password: 'securepassword123'
      };

      const result = insertUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('insertProjectSchema', () => {
    it('should validate valid project data', () => {
      const validData = {
        name: 'Kitchen Renovation',
        description: 'Complete kitchen remodel',
        address: '123 Main St',
        status: 'active',
        companyId: 1,
        clientId: 2,
        budgetTotal: '50000.00',
        startDate: new Date('2024-01-01'),
        dueDate: new Date('2024-03-01')
      };

      const result = insertProjectSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        description: 'Missing name and other required fields'
      };

      const result = insertProjectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        name: 'Kitchen Renovation',
        status: 'invalid-status',
        companyId: 1,
        clientId: 2
      };

      const result = insertProjectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('insertContactSchema', () => {
    it('should validate valid contact data', () => {
      const validData = {
        type: 'client',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        company: 'Smith Industries',
        companyId: 1
      };

      const result = insertContactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid contact type', () => {
      const invalidData = {
        type: 'invalid-type',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        companyId: 1
      };

      const result = insertContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle optional fields', () => {
      const minimalData = {
        type: 'client',
        firstName: 'Jane',
        lastName: 'Smith',
        companyId: 1
      };

      const result = insertContactSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });
});