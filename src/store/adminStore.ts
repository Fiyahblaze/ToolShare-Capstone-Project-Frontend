import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserAction {
  type: string;
  page: string;
  timestamp: string;
  details: string;
}

export interface UserSession {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  pages: string[];
  timeSpent: number; // in minutes
  actions: UserAction[];
}

export interface SiteVisitor {
  id: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  visitTime: string;
  lastSeen: string;
  pages: string[];
  timeSpent: number;
  referrer: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  isRegistered: boolean;
  userId?: string;
}

export interface AppAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalSessions: number;
  activeSessions: number;
  totalPageViews: number;
  averageSessionTime: number;
  bounceRate: number;
  topPages: { page: string; views: number }[];
  userGrowth: { date: string; users: number }[];
  revenueData: { date: string; amount: number }[];
  toolsPosted: number;
  rentalsCompleted: number;
  conversionRate: number;
}

interface AdminState {
  isAdminAuthenticated: boolean;
  userSessions: UserSession[];
  siteVisitors: SiteVisitor[];
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  trackUserSession: (userId: string, userEmail: string, userName: string) => void;
  trackSiteVisitor: () => void;
  updateUserActivity: (sessionId: string, page: string, action?: string) => void;
  endUserSession: (sessionId: string) => void;
  getAnalytics: () => AppAnalytics;
  getUserActivity: (userId: string) => UserSession[];
  getActiveUsers: () => UserSession[];
  getSiteTraffic: () => SiteVisitor[];
  getRealTimeMetrics: () => {
    activeUsers: number;
    pageViewsPerMinute: number;
    averageSessionTime: number;
    bounceRate: number;
  };
}

const generateSessionId = () => `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const detectDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop';
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
};

const detectBrowser = (): string => {
  if (typeof window === 'undefined') return 'Unknown';
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
};

const detectOS = (): string => {
  if (typeof window === 'undefined') return 'Unknown';
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
};

const getMockLocation = () => ({
  country: 'USA',
  city: 'San Francisco',
  region: 'CA'
});

const getCurrentPath = () => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};

const getReferrer = () => {
  if (typeof window === 'undefined') return 'direct';
  return document.referrer || 'direct';
};

const getUserAgent = () => {
  if (typeof window === 'undefined') return 'Unknown';
  return navigator.userAgent;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAdminAuthenticated: false,
      userSessions: [],
      siteVisitors: [],

      adminLogin: async (email: string, password: string) => {
        // Check admin credentials
        if (email === 'toolshareconnect@gmail.com' && password === 'Vers12345#') {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },

      adminLogout: () => {
        set({ isAdminAuthenticated: false });
      },

      trackUserSession: (userId: string, userEmail: string, userName: string) => {
        const sessionId = generateSessionId();
        const newSession: UserSession = {
          id: Date.now().toString(),
          userId,
          userName,
          userEmail,
          sessionId,
          ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
          userAgent: getUserAgent(),
          location: getMockLocation(),
          loginTime: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          isActive: true,
          deviceType: detectDeviceType(),
          browser: detectBrowser(),
          os: detectOS(),
          pages: [getCurrentPath()],
          timeSpent: 0,
          actions: [{
            type: 'login',
            page: getCurrentPath(),
            timestamp: new Date().toISOString(),
            details: 'User logged in'
          }]
        };

        set(state => ({
          userSessions: [...state.userSessions, newSession]
        }));
      },

      trackSiteVisitor: () => {
        const sessionId = generateSessionId();
        const newVisitor: SiteVisitor = {
          id: Date.now().toString(),
          sessionId,
          ipAddress: '203.0.113.' + Math.floor(Math.random() * 255),
          userAgent: getUserAgent(),
          location: getMockLocation(),
          visitTime: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          pages: [getCurrentPath()],
          timeSpent: 0,
          referrer: getReferrer(),
          deviceType: detectDeviceType(),
          browser: detectBrowser(),
          os: detectOS(),
          isRegistered: false
        };

        set(state => ({
          siteVisitors: [...state.siteVisitors, newVisitor]
        }));
      },

      updateUserActivity: (sessionId: string, page: string, action?: string) => {
        set(state => ({
          userSessions: state.userSessions.map(session => {
            if (session.sessionId === sessionId) {
              const updatedPages = session.pages.includes(page) 
                ? session.pages 
                : [...session.pages, page];
              
              const newAction: UserAction | null = action ? {
                type: action,
                page,
                timestamp: new Date().toISOString(),
                details: `${action} on ${page}`
              } : null;

              return {
                ...session,
                lastActivity: new Date().toISOString(),
                pages: updatedPages,
                timeSpent: session.timeSpent + 1,
                actions: newAction ? [...session.actions, newAction] : session.actions
              };
            }
            return session;
          })
        }));
      },

      endUserSession: (sessionId: string) => {
        set(state => ({
          userSessions: state.userSessions.map(session => 
            session.sessionId === sessionId 
              ? { ...session, isActive: false }
              : session
          )
        }));
      },

      getAnalytics: () => {
        const state = get();
        
        // Calculate real analytics from actual data
        const activeSessions = state.userSessions.filter(s => s.isActive);
        const totalPageViews = state.userSessions.reduce((sum, session) => sum + session.pages.length, 0) +
                              state.siteVisitors.reduce((sum, visitor) => sum + visitor.pages.length, 0);
        
        const averageSessionTime = state.userSessions.length > 0 
          ? state.userSessions.reduce((sum, session) => sum + session.timeSpent, 0) / state.userSessions.length
          : 0;

        // Calculate page views by page
        const pageViewCounts: { [key: string]: number } = {};
        
        // Process user sessions
        state.userSessions.forEach(session => {
          session.pages.forEach(page => {
            pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
          });
        });
        
        // Process site visitors
        state.siteVisitors.forEach(visitor => {
          visitor.pages.forEach(page => {
            pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
          });
        });

        const topPages = Object.entries(pageViewCounts)
          .map(([page, views]) => ({ page, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // Calculate bounce rate (visitors who viewed only 1 page)
        const singlePageSessions = [...state.userSessions, ...state.siteVisitors]
          .filter(session => session.pages.length === 1).length;
        const totalSessions = state.userSessions.length + state.siteVisitors.length;
        const bounceRate = totalSessions > 0 ? (singlePageSessions / totalSessions) * 100 : 0;

        // Generate user growth data from actual sessions
        const userGrowthData: { [key: string]: number } = {};
        state.userSessions.forEach(session => {
          const date = new Date(session.loginTime).toISOString().split('T')[0];
          userGrowthData[date] = (userGrowthData[date] || 0) + 1;
        });

        const userGrowth = Object.entries(userGrowthData)
          .map(([date, users]) => ({ date, users }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-7); // Last 7 days

        return {
          totalUsers: state.userSessions.length,
          activeUsers: activeSessions.length,
          newUsersToday: state.userSessions.filter(s => {
            const today = new Date().toISOString().split('T')[0];
            return s.loginTime.startsWith(today);
          }).length,
          totalSessions: totalSessions,
          activeSessions: activeSessions.length,
          totalPageViews,
          averageSessionTime,
          bounceRate,
          topPages,
          userGrowth,
          revenueData: [], // Will be calculated from actual rental data
          toolsPosted: 0, // Will be calculated from actual tool data
          rentalsCompleted: 0, // Will be calculated from actual rental data
          conversionRate: 0 // Will be calculated from actual conversion data
        };
      },

      getUserActivity: (userId: string) => {
        const state = get();
        return state.userSessions.filter(session => session.userId === userId);
      },

      getActiveUsers: () => {
        const state = get();
        return state.userSessions.filter(session => session.isActive);
      },

      getSiteTraffic: () => {
        const state = get();
        return state.siteVisitors;
      },

      getRealTimeMetrics: () => {
        const state = get();
        const activeSessions = state.userSessions.filter(s => s.isActive);
        
        // Calculate page views in the last minute
        const oneMinuteAgo = new Date(Date.now() - 60000);
        const recentPageViews = state.userSessions.reduce((count, session) => {
          const recentActions = session.actions.filter(action => 
            new Date(action.timestamp) > oneMinuteAgo
          );
          return count + recentActions.length;
        }, 0);

        const averageSessionTime = state.userSessions.length > 0 
          ? state.userSessions.reduce((sum, session) => sum + session.timeSpent, 0) / state.userSessions.length
          : 0;

        // Calculate bounce rate
        const singlePageSessions = [...state.userSessions, ...state.siteVisitors]
          .filter(session => session.pages.length === 1).length;
        const totalSessions = state.userSessions.length + state.siteVisitors.length;
        const bounceRate = totalSessions > 0 ? (singlePageSessions / totalSessions) * 100 : 0;

        return {
          activeUsers: activeSessions.length,
          pageViewsPerMinute: recentPageViews,
          averageSessionTime,
          bounceRate
        };
      }
    }),
    {
      name: 'admin-storage',
    }
  )
);