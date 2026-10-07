import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Don't show header on auth page when it's the main auth flow
  const hideHeader = location.pathname === '/auth' && location.search === '';

  // Track site visitors and page views
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Track site visitor on first load
    if (!sessionStorage.getItem('visitor_tracked')) {
      import('../store/adminStore').then(({ useAdminStore }) => {
        const { trackSiteVisitor } = useAdminStore.getState();
        trackSiteVisitor();
        sessionStorage.setItem('visitor_tracked', 'true');
      }).catch(() => {
        // Silently handle import errors during build
      });
    }

    // Update user activity for page changes
    const sessionId = sessionStorage.getItem('current_session_id');
    if (sessionId) {
      import('../store/adminStore').then(({ useAdminStore }) => {
        const { updateUserActivity } = useAdminStore.getState();
        updateUserActivity(sessionId, location.pathname, 'page_view');
      }).catch(() => {
        // Silently handle import errors during build
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full max-w-full overflow-x-hidden">
      {!hideHeader && <Header />}
      <main className="flex-1 pb-20 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;