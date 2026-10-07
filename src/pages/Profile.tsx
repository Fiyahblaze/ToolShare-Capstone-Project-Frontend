import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Star, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  Shield, 
  Award,
  TrendingUp,
  Settings,
  LogOut,
  CreditCard,
  Crown
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToolStore } from '../store/toolStore';
import { useRentalStore } from '../store/rentalStore';
import ToolCard from '../components/ToolCard';
import PaymentHistory from '../components/PaymentHistory';
import SubscriptionManager from '../components/SubscriptionManager';
import toast from 'react-hot-toast';

// Define proper types for activity data
interface ActivityItem {
  id: string;
  type: 'rented' | 'rented_out' | 'posted';
  description: string;
  date: string;
  timestamp: number;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'reviews' | 'subscription' | 'payments' | 'settings'>('overview');
  const { user, logout } = useAuthStore();
  const { tools } = useToolStore();
  const { getUserRentals, getOwnerRentals } = useRentalStore();

  const userTools = tools.filter(tool => tool.owner.id === user!.id);
  const userRentals = getUserRentals(user!.id);
  const ownerRentals = getOwnerRentals(user!.id);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'tools', label: 'My Tools', icon: Award, count: userTools.length },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const achievements = [
    { title: 'Verified User', icon: Shield, color: 'text-green-600', earned: user?.verified },
    { title: 'Top Renter', icon: TrendingUp, color: 'text-blue-600', earned: userRentals.length >= 5 },
    { title: 'Tool Master', icon: Award, color: 'text-yellow-600', earned: userTools.length >= 3 },
    { title: 'Community Helper', icon: Star, color: 'text-purple-600', earned: (user!.rating || 0) >= 4.5 },
  ];

  // Default blank avatar
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0zMCAxMjBDMzAgMTA0LjUzNiA0Mi41MzYgOTIgNTggOTJIOTJDMTA3LjQ2NCA5MiAxMjAgMTA0LjUzNiAxMjAgMTIwVjE1MEgzMFYxMjBaIiBmaWxsPSIjOUI5QkEzIi8+Cjwvc3ZnPgo=';

  // Get recent activity from actual rental data with proper typing
  const getRecentActivity = (): ActivityItem[] => {
    const allActivity: ActivityItem[] = [];
    
    // Add user rentals (tools they rented)
    userRentals.forEach(rental => {
      allActivity.push({
        id: `user-rental-${rental.id}`,
        type: 'rented',
        description: `Rented ${rental.toolTitle} from ${rental.ownerName}`,
        date: rental.createdAt,
        timestamp: new Date(rental.createdAt).getTime()
      });
    });

    // Add owner rentals (tools they rented out)
    ownerRentals.forEach(rental => {
      allActivity.push({
        id: `owner-rental-${rental.id}`,
        type: 'rented_out',
        description: `${rental.renterName} rented your ${rental.toolTitle}`,
        date: rental.createdAt,
        timestamp: new Date(rental.createdAt).getTime()
      });
    });

    // Add tool postings
    userTools.forEach(tool => {
      allActivity.push({
        id: `tool-posted-${tool.id}`,
        type: 'posted',
        description: `Posted ${tool.title} for rent`,
        date: tool.createdAt,
        timestamp: new Date(tool.createdAt).getTime()
      });
    });

    // Sort by most recent first and return top 5
    return allActivity
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative flex-shrink-0">
              <img
                src={user?.avatar || defaultAvatar}
                alt={user?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-gray-100"
              />
              {user?.verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              )}
            </div>

            <div className="flex-1 w-full min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words">{user?.name}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mb-3 space-y-1 sm:space-y-0">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{user?.rating}</span>
                      <span className="ml-1">({user?.totalRentals} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Joined {user?.joinedDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600">
                    <div className="flex items-center break-all">
                      <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>{user?.phone}</span>
                    </div>
                  </div>
                </div>

                <button className="btn-outline flex items-center mt-4 sm:mt-0 w-full sm:w-auto justify-center">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{userTools.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Tools Listed</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{userRentals.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Tools Rented</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{ownerRentals.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Times Rented Out</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                ${ownerRentals.reduce((sum, rental) => sum + rental.totalCost, 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Total Earned</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  {'count' in tab && tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Achievements */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={achievement.title}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        achievement.earned
                          ? 'border-primary-200 bg-primary-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <achievement.icon className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 ${
                        achievement.earned ? achievement.color : 'text-gray-400'
                      }`} />
                      <p className={`text-sm font-medium break-words ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-gray-500">No recent activity</p>
                      <p className="text-sm text-gray-400 mt-1">Start renting or posting tools to see activity here</p>
                    </div>
                  ) : (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 py-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          activity.type === 'rented' ? 'bg-blue-500' :
                          activity.type === 'rented_out' ? 'bg-green-500' :
                          'bg-primary-500'
                        }`}></div>
                        <p className="text-sm text-gray-700 break-words flex-1 min-w-0">
                          {activity.description}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {activity.date}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {userTools.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔧</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools listed yet</h3>
                  <p className="text-gray-600 mb-4">Start sharing your tools with the community</p>
                  <button className="btn-primary">Post Your First Tool</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {userTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <ToolCard tool={tool} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews & Ratings</h3>
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Reviews will appear here after your first rental</p>
              </div>
            </motion.div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SubscriptionManager />
            </motion.div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PaymentHistory />
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600 break-words">Receive updates about your rentals</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-600 break-words">Get text alerts for urgent updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-gray-900">Location Services</p>
                      <p className="text-sm text-gray-600 break-words">Show tools near your location</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium text-gray-900">Payment Methods</p>
                    <p className="text-sm text-gray-600 break-words">Manage your saved payment methods</p>
                  </button>
                  
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium text-gray-900">Billing History</p>
                    <p className="text-sm text-gray-600 break-words">View all your transactions and receipts</p>
                  </button>
                  
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium text-gray-900">Auto-Pay Settings</p>
                    <p className="text-sm text-gray-600 break-words">Configure automatic payment preferences</p>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-600 break-words">Update your account password</p>
                  </button>
                  
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium text-gray-900">Privacy Settings</p>
                    <p className="text-sm text-gray-600 break-words">Control who can see your information</p>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium">Sign Out</p>
                        <p className="text-sm text-red-500 break-words">Sign out of your account</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;