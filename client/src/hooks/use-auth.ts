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
          try {
            const user = JSON.parse(cachedUser);
            
            // Validate with server immediately for cached sessions
            const validatedUser = await authManager.validateSession();
            if (validatedUser) {
              setUser(validatedUser);
              setIsAuthenticated(true);
              // Update cache with fresh data
              localStorage.setItem('user', JSON.stringify(validatedUser));
            } else {
              console.log('Cached session invalid, clearing');
              setUser(null);
              setIsAuthenticated(false);
              authManager.clearSession();
            }
          } catch (error) {
            console.error('Failed to validate cached session:', error);
            authManager.clearSession();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No cached session, validate with server
          const validatedUser = await authManager.validateSession();
          if (validatedUser) {
            setUser(validatedUser);
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(validatedUser));
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        setUser(null);
        setIsAuthenticated(false);
        authManager.clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (username: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const user = await authManager.login(username, password);
      
      // Update state immediately
      setUser(user);
      setIsAuthenticated(true);
      
      return user;
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
