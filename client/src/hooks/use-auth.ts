import { useState, useEffect } from 'react';
import { authManager } from '@/lib/auth';
import { AuthUser } from '@shared/schema';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const validatedUser = await authManager.validateSession();
        setUser(validatedUser);
        setIsAuthenticated(!!validatedUser);
      } catch (error) {
        console.error('Session validation failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await authManager.login(username, password);
      setUser(user);
      setIsAuthenticated(true);
      // Force a re-render by updating state
      window.location.reload();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authManager.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
