import React, { useState } from 'react';
import { Search, MapPin, TrendingUp, Clock, List, Map, MessageCircle, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToolStore } from '../store/toolStore';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import ToolCard from '../components/ToolCard';
import AIAssistant from '../components/AIAssistant';
import InteractiveMap from '../components/InteractiveMap';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { tools, setSearchQuery, setSelectedCategory } = useToolStore();
  const { user, isAuthenticated } = useAuthStore();
  const { getTotalUnread } = useMessageStore();
  const [searchInput, setSearchInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [nearbyViewMode, setNearbyViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showNearbyView, setShowNearbyView] = useState(false);

  const featuredTools = tools.slice(0, 6);
  const nearbyTools = tools.filter(tool => tool.location.city === 'San Francisco').slice(0, showNearbyView ? 12 : 4);
  const totalUnreadMessages = isAuthenticated ? getTotalUnread() : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate('/search');
    toast.success(`Searching for "${searchInput}"`);
  };

  const handleAISuggestion = (suggestion: string) => {
    setAiSuggestion(suggestion);
    toast.success('AI suggestions ready!');
  };

  const handleNearbyClick = () => {
    setShowNearbyView(!showNearbyView);
    const toolCount = tools.filter(tool => tool.location.city === 'San Francisco').length;
    toast.success(`${showNearbyView ? 'Showing fewer' : 'Showing all'} nearby tools (${toolCount} total)`);
  };

  const handleToolSelect = (tool: any) => {
    navigate(`/tool/${tool.id}`);
    toast.success(`Viewing ${tool.title}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    navigate('/search');
    toast.success(`Browsing ${categoryName}`);
  };

  const handleToolsAvailableClick = () => {
    navigate('/search');
    toast.success('Browsing all available tools');
  };

  const handleMessagesClick = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to view messages');
      navigate('/auth');
      return;
    }
    toast.success(`You have ${totalUnreadMessages} unread messages`);
  };

  const handleAvailableClick = () => {
    toast.success('All tools are available 24/7 for your convenience!');
  };

  const handleFeaturedViewAll = () => {
    setSearchQuery('');
    navigate('/search');
    toast.success('Viewing all featured tools');
  };

  const handleSignInPrompt = () => {
    navigate('/auth');
    toast.success('Join ToolShare to unlock all features!');
  };

  const categories = [
    { name: 'Power Tools', icon: '🔧', count: 150 },
    { name: 'Garden Tools', icon: '🌱', count: 89 },
    { name: 'Beauty Tools', icon: '💄', count: 45 },
    { name: 'Automotive', icon: '🚗', count: 67 },
    { name: 'Construction', icon: '🏗️', count: 123 },
    { name: 'Painting', icon: '🎨', count: 34 },
    { name: 'Cleaning', icon: '🧽', count: 28 },
    { name: 'Kitchen Tools', icon: '🍳', count: 52 },
    { name: 'Photography', icon: '📸', count: 31 },
    { name: 'Sports Equipment', icon: '⚽', count: 76 },
    { name: 'Musical Instruments', icon: '🎸', count: 19 },
    { name: 'Electronics', icon: '💻', count: 43 },
    { name: 'Woodworking', icon: '🪚', count: 38 },
    { name: 'Plumbing', icon: '🔧', count: 25 },
    { name: 'Electrical', icon: '⚡', count: 29 },
    { name: 'Moving & Storage', icon: '📦', count: 22 },
    { name: 'Party & Events', icon: '🎉', count: 35 },
    { name: 'Outdoor Recreation', icon: '🏕️', count: 41 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {isAuthenticated ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">Find the perfect tool for your next project</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to ToolShare! 🛠️
            </h1>
            <p className="text-gray-600">
              Discover and rent tools from your community. 
              <button 
                onClick={handleSignInPrompt}
                className="text-primary-600 hover:text-primary-700 font-medium ml-1"
              >
                Sign up to rent or post tools →
              </button>
            </p>
          </>
        )}
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={isAuthenticated 
                ? "Search for tools, projects, or ask AI for help..."
                : "Search for tools and browse our community marketplace..."
              }
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>
        </form>
      </motion.div>

      {/* Guest CTA Banner */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Join the ToolShare Community
              </h3>
              <p className="text-gray-600 mb-4">
                Rent tools from verified neighbors, earn money by sharing your tools, and access exclusive features.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>✓ Verified users</span>
                <span>✓ Secure payments</span>
                <span>✓ Insurance coverage</span>
                <span>✓ 24/7 support</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary whitespace-nowrap"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Join Now
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="btn-outline whitespace-nowrap text-sm"
              >
                Sign In
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Suggestion */}
      {aiSuggestion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200"
        >
          <div className="flex items-start">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-full mr-3 flex-shrink-0">
              <span className="text-white text-sm">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Suggestion</h3>
              <p className="text-gray-700">{aiSuggestion}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <button
          onClick={handleToolsAvailableClick}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-2 rounded-lg mr-3 group-hover:bg-primary-200 transition-colors">
              <TrendingUp className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">1,234</p>
              <p className="text-sm text-gray-600 group-hover:text-primary-700 transition-colors">Tools Available</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={handleNearbyClick}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-secondary-200 transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center">
            <div className="bg-secondary-100 p-2 rounded-lg mr-3 group-hover:bg-secondary-200 transition-colors">
              <MapPin className="h-5 w-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-secondary-600 transition-colors">89</p>
              <p className="text-sm text-gray-600 group-hover:text-secondary-700 transition-colors">
                Nearby
              </p>
            </div>
          </div>
        </button>
        
        <button
          onClick={handleAvailableClick}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-200 transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3 group-hover:bg-green-200 transition-colors">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">24/7</p>
              <p className="text-sm text-gray-600 group-hover:text-green-700 transition-colors">Available</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={handleMessagesClick}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer text-left group relative"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {isAuthenticated ? totalUnreadMessages : '?'}
              </p>
              <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors">
                Messages
              </p>
            </div>
          </div>
          {isAuthenticated && totalUnreadMessages > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalUnreadMessages > 9 ? '9+' : totalUnreadMessages}
            </div>
          )}
          {!isAuthenticated && (
            <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              <LogIn className="h-3 w-3" />
            </div>
          )}
        </button>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</div>
              <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-primary-600 transition-colors">{category.name}</h3>
              <p className="text-xs text-gray-600 group-hover:text-primary-700 transition-colors">{category.count} tools</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Nearby Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Nearby Tools {showNearbyView && `(${nearbyTools.length} shown)`}
          </h2>
          <div className="flex items-center space-x-3">
            {showNearbyView && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setNearbyViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    nearbyViewMode === 'grid'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title="Grid view"
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setNearbyViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    nearbyViewMode === 'list'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setNearbyViewMode('map')}
                  className={`p-2 rounded-lg transition-colors ${
                    nearbyViewMode === 'map'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title="Map view"
                >
                  <Map className="h-4 w-4" />
                </button>
              </div>
            )}
            <button 
              onClick={handleNearbyClick}
              className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer hover:underline transition-colors"
            >
              {showNearbyView ? 'Show Less' : 'View All'}
            </button>
          </div>
        </div>

        {nearbyViewMode === 'map' && showNearbyView ? (
          <InteractiveMap 
            tools={nearbyTools} 
            onToolSelect={handleToolSelect}
          />
        ) : (
          <div className={`grid gap-6 ${
            nearbyViewMode === 'list' && showNearbyView
              ? 'grid-cols-1'
              : showNearbyView
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {nearbyTools.map((tool, index) => (
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

      {/* Featured Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Featured Tools</h2>
          <button 
            onClick={handleFeaturedViewAll}
            className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer hover:underline transition-colors"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool, index) => (
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
      </motion.div>

      {/* AI Assistant - Only show for authenticated users */}
      {isAuthenticated && <AIAssistant onSuggestion={handleAISuggestion} />}
    </div>
  );
};

export default Home;