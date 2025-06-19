import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../../client/src/hooks/use-auth';

// Mock the auth manager
vi.mock('../../client/src/lib/auth', () => ({
  authManager: {
    login: vi.fn(),
    logout: vi.fn(),
    validateSession: vi.fn(),
    clearSession: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useAuth Hook', () => {
  const mockAuthManager = await import('../../client/src/lib/auth');
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with loading state', () => {
    mockAuthManager.authManager.validateSession.mockResolvedValue(null);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should set authenticated state when session is valid', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'employee',
      companyId: 1,
      phone: '+1234567890',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockAuthManager.authManager.validateSession.mockResolvedValue(mockUser);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle login successfully', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'employee',
      companyId: 1,
      phone: '+1234567890',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockAuthManager.authManager.validateSession.mockResolvedValue(null);
    mockAuthManager.authManager.login.mockResolvedValue(mockUser);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);

    // Perform login
    await result.current.login('testuser', 'password');

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  it('should handle login failure', async () => {
    mockAuthManager.authManager.validateSession.mockResolvedValue(null);
    mockAuthManager.authManager.login.mockRejectedValue(new Error('Invalid credentials'));
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Attempt login
    await expect(result.current.login('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should handle logout', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'employee',
      companyId: 1,
      phone: '+1234567890',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Start with authenticated user
    mockAuthManager.authManager.validateSession.mockResolvedValue(mockUser);
    mockAuthManager.authManager.logout.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Perform logout
    await result.current.logout();

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(mockAuthManager.authManager.clearSession).toHaveBeenCalled();
  });

  it('should use cached authentication state', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'employee',
      companyId: 1,
      phone: '+1234567890',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Set up localStorage cache
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    mockAuthManager.authManager.validateSession.mockResolvedValue(mockUser);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    // Should immediately use cached data
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });
});