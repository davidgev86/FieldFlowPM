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
            setUser(user);
            setIsAuthenticated(true);
            
            // Validate with server in background
            authManager.validateSession().then((validatedUser) => {
              if (!validatedUser) {
                console.log('Server session validation failed, clearing cache');
                setUser(null);
                setIsAuthenticated(false);
                authManager.clearSession();
              } else {
                // Update with fresh user data from server
                setUser(validatedUser);
                localStorage.setItem('user', JSON.stringify(validatedUser));
              }
            }).catch((error) => {
              console.error('Background session validation failed:', error);
              setUser(null);
              setIsAuthenticated(false);
              authManager.clearSession();
            });
          } catch (error) {
            console.error('Failed to parse cached user data:', error);
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
      
      // Update state synchronously
      setUser(user);
      setIsAuthenticated(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      
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
