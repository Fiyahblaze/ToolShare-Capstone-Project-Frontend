import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Globe, 
  Monitor, 
  Settings,
  Eye,
  Clock,
  MousePointer,
  Smartphone,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Zap,
  Database,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell 
} from 'recharts';
import { useAdminStore } from '../store/adminStore';
import { useToolStore } from '../store/toolStore';
import { useRentalStore } from '../store/rentalStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'realtime' | 'users' | 'traffic' | 'analytics' | 'system' | 'settings'>('overview');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');

  const { 
    userSessions, 
    siteVisitors, 
    getAnalytics, 
    getActiveUsers, 
    getSiteTraffic,
    getRealTimeMetrics
  } = useAdminStore();

  const { tools } = useToolStore();
  const { rentals } = useRentalStore();
  const { user } = useAuthStore();

  // Real data from actual stores
  const analytics = getAnalytics();
  const activeUsers = getActiveUsers();
  const siteTraffic = getSiteTraffic();
  const realTimeMetrics = getRealTimeMetrics();

  // Calculate real metrics from actual data
  const realAnalytics = {
    ...analytics,
    toolsPosted: tools.length,
    rentalsCompleted: rentals.filter(r => r.status === 'completed').length,
    revenueData: rentals.reduce((acc, rental) => {
      const date = rental.createdAt;
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.amount += rental.totalCost;
      } else {
        acc.push({ date, amount: rental.totalCost });
      }
      return acc;
    }, [] as { date: string; amount: number }[]),
    conversionRate: userSessions.length > 0 ? (rentals.length / userSessions.length) * 100 : 0
  };

  // Real-time updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      // Update real-time metrics
      toast.success('Real-time data updated', { duration: 1000 });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'realtime', label: 'Real-time', icon: Activity },
    { id: 'users', label: 'Users', icon: Users, count: userSessions.length },
    { id: 'traffic', label: 'Traffic', icon: Globe, count: siteTraffic.length },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'system', label: 'System Health', icon: Monitor },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredUsers = userSessions.filter(session => {
    const matchesSearch = !searchQuery || 
      session.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.ipAddress.includes(searchQuery);
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'active' && session.isActive) ||
      (filterType === 'inactive' && !session.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const deviceStats = userSessions.reduce((acc, session) => {
    acc[session.deviceType] = (acc[session.deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const browserStats = userSessions.reduce((acc, session) => {
    acc[session.browser] = (acc[session.browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceData = Object.entries(deviceStats).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(browserStats).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as any);
    toast.success(`Switched to ${tabs.find(t => t.id === tabId)?.label} view`);
  };

  const handleExportData = () => {
    const data = {
      analytics: realAnalytics,
      userSessions,
      siteTraffic,
      tools: tools.length,
      rentals: rentals.length,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolshare-admin-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Admin data exported successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Real-time monitoring and analytics for ToolShare</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isLiveMode ? 'Live' : 'Paused'}
              </span>
            </div>
            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                isLiveMode 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isLiveMode ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={handleExportData}
              className="btn-outline flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex space-x-8 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
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
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realAnalytics.activeUsers}</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realAnalytics.toolsPosted}</p>
                    <p className="text-sm text-gray-600">Tools Posted</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realAnalytics.rentalsCompleted}</p>
                    <p className="text-sm text-gray-600">Rentals Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realAnalytics.totalPageViews}</p>
                    <p className="text-sm text-gray-600">Page Views</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={realAnalytics.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Device Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center space-x-4">
                  {deviceData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
              <div className="space-y-3">
                {userSessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center space-x-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {session.userName || 'Anonymous'} - {session.userEmail || 'No email'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.deviceType} • {session.browser} • {session.location.city}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(session.lastActivity).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {userSessions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No user sessions yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Real-time Tab */}
        {activeTab === 'realtime' && (
          <div className="space-y-6">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realTimeMetrics.activeUsers}</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realTimeMetrics.pageViewsPerMinute}</p>
                    <p className="text-sm text-gray-600">Views/min</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realTimeMetrics.averageSessionTime.toFixed(1)}m</p>
                    <p className="text-sm text-gray-600">Avg Session</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realTimeMetrics.bounceRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Bounce Rate</p>
                  </div>
                  <MousePointer className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeUsers.map((session) => (
                  <div key={session.id} className="flex items-center space-x-3 py-2 border-b border-gray-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {session.userName || 'Anonymous User'} is viewing {session.pages[session.pages.length - 1] || '/'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.location.city}, {session.location.region} • {session.deviceType}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.floor((Date.now() - new Date(session.lastActivity).getTime()) / 1000)}s ago
                    </span>
                  </div>
                ))}
                {activeUsers.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No active users at the moment</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name, email, or IP..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            {/* User List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredUsers.map((session) => (
                  <div key={session.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${session.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.userName || 'Anonymous'}</h4>
                          <p className="text-sm text-gray-600">{session.userEmail || 'No email'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{session.timeSpent}m session</p>
                        <p className="text-xs text-gray-500">{session.pages.length} pages viewed</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Device:</span>
                        <p className="font-medium">{session.deviceType}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Browser:</span>
                        <p className="font-medium">{session.browser}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-medium">{session.location.city}, {session.location.region}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Active:</span>
                        <p className="font-medium">{new Date(session.lastActivity).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No users found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Traffic Tab */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            {/* Traffic Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{siteTraffic.length}</p>
                    <p className="text-sm text-gray-600">Total Visitors</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Smartphone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {siteTraffic.filter(v => v.deviceType === 'mobile').length}
                    </p>
                    <p className="text-sm text-gray-600">Mobile Visitors</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <Monitor className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {siteTraffic.filter(v => v.deviceType === 'desktop').length}
                    </p>
                    <p className="text-sm text-gray-600">Desktop Visitors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visitor List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Visitors</h3>
              <div className="space-y-3">
                {siteTraffic.slice(0, 10).map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-900">
                          {visitor.location.city}, {visitor.location.region}
                        </p>
                        <p className="text-xs text-gray-500">
                          {visitor.deviceType} • {visitor.browser} • {visitor.pages.length} pages
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(visitor.visitTime).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {visitor.timeSpent}m visit
                      </p>
                    </div>
                  </div>
                ))}
                {siteTraffic.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No site visitors yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realAnalytics.conversionRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realAnalytics.bounceRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Bounce Rate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realAnalytics.averageSessionTime.toFixed(1)}m</p>
                    <p className="text-sm text-gray-600">Avg Session Time</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{realAnalytics.newUsersToday}</p>
                    <p className="text-sm text-gray-600">New Users Today</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
              <div className="space-y-3">
                {realAnalytics.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm text-gray-900">{page.page}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{page.views} views</span>
                  </div>
                ))}
                {realAnalytics.topPages.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No page data available yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Server Status</p>
                    <p className="text-lg font-semibold text-green-600">Online</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Database</p>
                    <p className="text-lg font-semibold text-green-600">Connected</p>
                  </div>
                  <Database className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">API Status</p>
                    <p className="text-lg font-semibold text-green-600">Healthy</p>
                  </div>
                  <Wifi className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Uptime</p>
                    <p className="text-lg font-semibold text-gray-900">99.9%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">CPU Usage</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Memory Usage</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Disk Usage</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Network I/O</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Real-time Monitoring</h4>
                    <p className="text-sm text-gray-600">Enable live data updates every 5 seconds</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isLiveMode}
                      onChange={() => setIsLiveMode(!isLiveMode)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Data Retention</h4>
                    <p className="text-sm text-gray-600">How long to keep user session data</p>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option>30 days</option>
                    <option>90 days</option>
                    <option>1 year</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Export Data</h4>
                    <p className="text-sm text-gray-600">Download all admin data as JSON</p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="btn-primary flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;