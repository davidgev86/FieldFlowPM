import { AuthUser } from "@shared/schema";

export interface AuthState {
  user: AuthUser | null;
  sessionId: string | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private sessionId: string | null = null;
  private user: AuthUser | null = null;

  constructor() {
    // Load session from localStorage on initialization
    this.loadSession();
  }

  private loadSession() {
    if (typeof window === 'undefined') return;
    
    try {
      const sessionId = localStorage.getItem('sessionId');
      const userData = localStorage.getItem('user');
      
      if (sessionId && userData) {
        this.sessionId = sessionId;
        this.user = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      this.clearSession();
    }
  }

  private saveSession(user: AuthUser) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      this.user = user;
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  clearSession() {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    this.user = null;
  }

  async login(username: string, password: string): Promise<AuthUser> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(error.message || 'Invalid credentials');
      }

      const user = await response.json();
      
      // Validate the response has required user data
      if (!user || !user.id || !user.username) {
        throw new Error('Invalid response from server');
      }
      
      // Save session data
      this.saveSession(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }
    
    this.clearSession();
  }

  async validateSession(): Promise<AuthUser | null> {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Session expired, clear local storage
          this.clearSession();
        }
        return null;
      }

      const user = await response.json();
      
      // Validate the response has required user data
      if (!user || !user.id || !user.username) {
        return null;
      }
      
      this.user = user;
      return user;
    } catch (error) {
      console.error('Session validation failed:', error);
      return null;
    }
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.sessionId) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${this.sessionId}`,
    };
  }

  getAuthState(): AuthState {
    return {
      user: this.user,
      sessionId: this.sessionId,
      isAuthenticated: !!this.user && !!this.sessionId,
    };
  }

  getCurrentUser(): AuthUser | null {
    return this.user;
  }
}

export const authManager = new AuthManager();
