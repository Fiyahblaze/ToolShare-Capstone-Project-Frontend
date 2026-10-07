import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, Calendar, User, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const BottomNavigation: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleProtectedRoute = (path: string, label: string) => {
    if (!isAuthenticated) {
      toast.error(`Please sign in to access ${label}`);
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Home', protected: false },
    { to: '/search', icon: Search, label: 'Search', protected: false },
    { to: '/post', icon: Plus, label: 'Post', protected: true },
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard', protected: true },
    { to: '/rentals', icon: Calendar, label: 'Rentals', protected: true },
    { to: '/profile', icon: User, label: 'Profile', protected: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around">
          {navItems.map(({ to, icon: Icon, label, protected: isProtected }) => (
            isProtected ? (
              <button
                key={to}
                onClick={() => handleProtectedRoute(to, label)}
                className="flex flex-col items-center py-2 px-1 text-xs transition-colors duration-200 text-gray-600 hover:text-gray-900 min-w-0 flex-1"
              >
                <Icon className="h-5 w-5 mb-1 text-gray-600" />
                <span className="text-xs truncate">{label}</span>
              </button>
            ) : (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center py-2 px-1 text-xs transition-colors duration-200 min-w-0 flex-1 ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={`h-5 w-5 mb-1 ${
                        isActive ? 'text-primary-600' : 'text-gray-600'
                      }`} 
                    />
                    <span className={`text-xs truncate ${isActive ? 'text-primary-600 font-medium' : ''}`}>
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;