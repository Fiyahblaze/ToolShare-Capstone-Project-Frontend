import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  totalRentals: number;
  totalListings: number;
  verified: boolean;
  joinedDate: string;
  role: 'user' | 'admin'; // Add role field
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean; // Add admin check
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User> & { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Default blank avatar - a simple gray placeholder
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0zMCAxMjBDMzAgMTA0LjUzNiA0Mi41MzYgOTIgNTggOTJIOTJDMTA3LjQ2NCA5MiAxMjAgMTA0LjUzNiAxMjAgMTIwVjE1MEgzMFYxMjBaIiBmaWxsPSIjOUI5QkEzIi8+Cjwvc3ZnPgo=';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let mockUser: User;
        
        // Check if admin credentials
        if (email === 'toolshareconnect@gmail.com' && password === 'Vers12345#') {
          mockUser = {
            id: 'admin-1',
            name: 'ToolShare Admin',
            email,
            phone: '+1 (555) 000-0000',
            avatar: DEFAULT_AVATAR,
            rating: 5.0,
            totalRentals: 0,
            totalListings: 0,
            verified: true,
            joinedDate: '2023-01-01',
            role: 'admin'
          };
        } else {
          // Regular user login
          mockUser = {
            id: '1',
            name: 'John Doe',
            email,
            phone: '+1 (555) 123-4567',
            avatar: DEFAULT_AVATAR,
            rating: 4.8,
            totalRentals: 23,
            totalListings: 8,
            verified: true,
            joinedDate: '2023-01-15',
            role: 'user'
          };
        }
        
        set({ 
          user: mockUser, 
          isAuthenticated: true,
          isAdmin: mockUser.role === 'admin'
        });
        
        // Track user session in admin store - use dynamic import to avoid circular dependency
        if (typeof window !== 'undefined') {
          import('./adminStore').then(({ useAdminStore }) => {
            const adminStore = useAdminStore.getState();
            adminStore.trackUserSession(mockUser.id, mockUser.email, mockUser.name);
            
            // Store session ID for tracking
            const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('current_session_id', sessionId);
          }).catch(() => {
            // Silently handle import errors during build
          });
        }
      },
      
      signup: async (userData) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name || '',
          email: userData.email,
          phone: userData.phone || '',
          avatar: DEFAULT_AVATAR,
          rating: 5.0,
          totalRentals: 0,
          totalListings: 0,
          verified: false,
          joinedDate: new Date().toISOString().split('T')[0],
          role: 'user' // New users are always regular users
        };
        
        set({ 
          user: newUser, 
          isAuthenticated: true,
          isAdmin: false
        });
        
        // Track user session in admin store - use dynamic import to avoid circular dependency
        if (typeof window !== 'undefined') {
          import('./adminStore').then(({ useAdminStore }) => {
            const adminStore = useAdminStore.getState();
            adminStore.trackUserSession(newUser.id, newUser.email, newUser.name);
            
            // Store session ID for tracking
            const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('current_session_id', sessionId);
          }).catch(() => {
            // Silently handle import errors during build
          });
        }
      },
      
      logout: () => {
        const currentUser = get().user;
        if (currentUser && typeof window !== 'undefined') {
          // End user session in admin store - use dynamic import to avoid circular dependency
          import('./adminStore').then(({ useAdminStore }) => {
            const adminStore = useAdminStore.getState();
            const userSession = adminStore.userSessions.find(s => s.userId === currentUser.id && s.isActive);
            if (userSession) {
              adminStore.endUserSession(userSession.sessionId);
            }
          }).catch(() => {
            // Silently handle import errors during build
          });
          
          // Clear session storage
          sessionStorage.removeItem('current_session_id');
          sessionStorage.removeItem('visitor_tracked');
        }
        
        set({ 
          user: null, 
          isAuthenticated: false,
          isAdmin: false
        });
        
        // Redirect to home page after logout
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
      
      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ 
            user: updatedUser,
            isAdmin: updatedUser.role === 'admin'
          });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);