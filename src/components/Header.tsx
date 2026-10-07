import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, LogIn, DollarSign, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import NotificationCenter from './NotificationCenter';
import MessageCenter from './MessageCenter';

const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  };

  const handlePricingClick = () => {
    navigate('/pricing');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={handleLogoClick}
              className="text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              ToolShare
            </button>
          </div>

          {/* Center Navigation - Only show on larger screens */}
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={handlePricingClick}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Pricing
            </button>
            
            {/* Location */}
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">San Francisco, CA</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Admin Access - Only show for admin users */}
                {isAdmin && (
                  <button
                    onClick={handleAdminClick}
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Admin Dashboard"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="hidden md:inline ml-1 text-sm font-medium">Admin</span>
                  </button>
                )}

                {/* Notifications */}
                <NotificationCenter />

                {/* Messages */}
                <MessageCenter />

                {/* Profile */}
                <button 
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-1 sm:p-2 transition-colors"
                >
                  <img
                    src={user?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0zMCAxMjBDMzAgMTA0LjUzNiA0Mi41MzYgOTIgNTggOTJIOTJDMTA3LjQ2NCA5MiAxMjAgMTA0LjUzNiAxMjAgMTIwVjE1MEgzMFYxMjBaIiBmaWxsPSIjOUI5QkEzIi8+Cjwvc3ZnPgo='}
                    alt={user?.name}
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover bg-gray-100"
                  />
                  <div className="hidden md:block text-left">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-24">{user?.name}</p>
                      {isAdmin && (
                        <Shield className="h-3 w-3 text-red-500 ml-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">⭐ {user?.rating}</p>
                  </div>
                </button>
              </>
            ) : (
              <>
                {/* Guest Actions */}
                <button
                  onClick={handlePricingClick}
                  className="hidden sm:flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Pricing</span>
                </button>
                <button
                  onClick={handleAuthClick}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden md:inline">Sign In</span>
                </button>
                <button
                  onClick={handleAuthClick}
                  className="btn-primary text-sm px-3 py-2"
                >
                  <span className="hidden sm:inline">Join ToolShare</span>
                  <span className="sm:hidden">Join</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;