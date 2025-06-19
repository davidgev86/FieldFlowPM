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
        // Check localStorage first for faster initial load
        const cachedAuth = localStorage.getItem('isAuthenticated');
        const cachedUser = localStorage.getItem('user');
        
        if (cachedAuth === 'true' && cachedUser) {
          const user = JSON.parse(cachedUser);
          setUser(user);
          setIsAuthenticated(true);
          setIsLoading(false);
          
          // Validate with server in background
          authManager.validateSession().then((validatedUser) => {
            if (!validatedUser) {
              // If server validation fails, clear cache and logout
              setUser(null);
              setIsAuthenticated(false);
              authManager.clearSession();
            }
          }).catch(() => {
            // If server validation fails, clear cache and logout
            setUser(null);
            setIsAuthenticated(false);
            authManager.clearSession();
          });
        } else {
          // No cached session, validate with server
          const validatedUser = await authManager.validateSession();
          setUser(validatedUser);
          setIsAuthenticated(!!validatedUser);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        setUser(null);
        setIsAuthenticated(false);
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
      
      // Store in localStorage for persistence
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
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
      authManager.clearSession();
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local state even if server logout fails
      setUser(null);
      setIsAuthenticated(false);
      authManager.clearSession();
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
