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

  private saveSession(sessionId: string, user: AuthUser) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('user', JSON.stringify(user));
      this.sessionId = sessionId;
      this.user = user;
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  private clearSession() {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    this.sessionId = null;
    this.user = null;
  }

  async login(username: string, password: string): Promise<AuthUser> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const { user, sessionId } = await response.json();
    this.saveSession(sessionId, user);
    return user;
  }

  async logout() {
    if (this.sessionId) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.sessionId}`,
          },
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    
    this.clearSession();
  }

  async validateSession(): Promise<AuthUser | null> {
    if (!this.sessionId) {
      return null;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.sessionId}`,
        },
      });

      if (!response.ok) {
        this.clearSession();
        return null;
      }

      const user = await response.json();
      this.user = user;
      return user;
    } catch (error) {
      console.error('Session validation failed:', error);
      this.clearSession();
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
