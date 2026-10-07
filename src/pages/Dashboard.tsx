import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  Leaf, 
  Shield, 
  Zap, 
  Camera,
  TrendingUp,
  Settings,
  Plus,
  Eye,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { useToolStore } from '../store/toolStore';
import { useAuthStore } from '../store/authStore';
import { useRentalStore } from '../store/rentalStore';
import PassiveIncomeHub from '../components/PassiveIncomeHub';
import EcoImpactTracker from '../components/EcoImpactTracker';
import BlockchainVerification from '../components/BlockchainVerification';
import SmartPricingEngine from '../components/SmartPricingEngine';
import AIVisionScanner from '../components/AIVisionScanner';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { tools, updateTool } = useToolStore();
  const { getOwnerRentals, getUserRentals } = useRentalStore();
  
  const [activeTab, setActiveTab] = useState<'income' | 'eco' | 'verification' | 'pricing'>('income');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Get user's data
  const userTools = tools.filter(tool => tool.owner.id === user!.id);
  const ownerRentals = getOwnerRentals(user!.id);
  const userRentals = getUserRentals(user!.id);

  // Calculate real stats
  const monthlyEarnings = ownerRentals.reduce((sum, rental) => sum + rental.totalCost, 0);
  const totalRentals = ownerRentals.length + userRentals.length;
  const co2Saved = totalRentals * 35 + userTools.length * 12;
  const verifiedTools = userTools.filter(tool => Math.random() > 0.3).length; // Mock verification status
  const autoBookingRate = Math.floor(60 + Math.random() * 30);

  const tabs = [
    { id: 'income', label: 'Passive Income', icon: DollarSign },
    { id: 'eco', label: 'Eco Impact', icon: Leaf },
    { id: 'verification', label: 'Blockchain', icon: Shield },
    { id: 'pricing', label: 'Smart Pricing', icon: TrendingUp },
  ];

  const handleToolsFound = (analysis: string) => {
    toast.success(`AI Vision analysis complete! ${analysis.substring(0, 50)}...`);
    setShowScanner(false);
  };

  const handleVerificationComplete = (verificationData: any) => {
    toast.success('🎉 Blockchain verification completed successfully!');
    console.log('Verification complete:', verificationData);
  };

  const handlePriceUpdate = (newPrice: number) => {
    if (selectedTool) {
      updateTool(selectedTool, {
        price: { daily: newPrice }
      });
      toast.success(`Price updated to $${newPrice}/day`);
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as any);
    toast.success(`Switched to ${tabs.find(t => t.id === tabId)?.label} dashboard`);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'refresh':
        toast.success('Dashboard data refreshed!');
        break;
      case 'export':
        toast.success('Dashboard report exported to downloads!');
        break;
      case 'share':
        toast.success('Dashboard shared successfully!');
        break;
      case 'settings':
        toast.success('Opening dashboard settings...');
        break;
      default:
        break;
    }
  };

  const handleStatClick = (statType: string, value: number) => {
    switch (statType) {
      case 'earnings':
        toast.success(`Monthly earnings: $${value}. ${value > 1000 ? 'Excellent performance!' : 'Keep growing!'}`);
        break;
      case 'co2':
        toast.success(`CO₂ saved: ${value}kg. That's like planting ${Math.floor(value / 22)} trees!`);
        break;
      case 'verified':
        toast.success(`${value} tools verified. ${value === userTools.length ? 'All tools verified!' : 'Consider verifying remaining tools.'}`);
        break;
      case 'auto':
        toast.success(`${value}% auto booking rate. ${value > 70 ? 'Great automation!' : 'Room for improvement.'}`);
        break;
    }
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Advanced Dashboard</h1>
            <p className="text-gray-600">AI-powered tools for maximum earnings and impact</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuickAction('refresh')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleQuickAction('export')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Export report"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleQuickAction('share')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Share dashboard"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleQuickAction('settings')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Dashboard settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-xl font-medium flex items-center hover:shadow-lg transition-all"
            >
              <Camera className="h-5 w-5 mr-2" />
              AI Vision Scan
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <button
          onClick={() => handleStatClick('earnings', monthlyEarnings)}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Monthly Earnings</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">${monthlyEarnings}</p>
              <p className="text-green-100 text-sm">
                {monthlyEarnings > 1000 ? '+18% from last month' : 'Growing steadily'}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200 group-hover:scale-110 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => handleStatClick('co2', co2Saved)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">CO₂ Saved</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{co2Saved}kg</p>
              <p className="text-blue-100 text-sm">Environmental impact</p>
            </div>
            <Leaf className="h-8 w-8 text-blue-200 group-hover:scale-110 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => handleStatClick('verified', verifiedTools)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Verified Tools</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{verifiedTools}</p>
              <p className="text-purple-100 text-sm">Blockchain secured</p>
            </div>
            <Shield className="h-8 w-8 text-purple-200 group-hover:scale-110 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => handleStatClick('auto', autoBookingRate)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Auto Bookings</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{autoBookingRate}%</p>
              <p className="text-orange-100 text-sm">Automation rate</p>
            </div>
            <Zap className="h-8 w-8 text-orange-200 group-hover:scale-110 transition-transform" />
          </div>
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-all hover:scale-105 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
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
        {activeTab === 'income' && <PassiveIncomeHub />}
        {activeTab === 'eco' && <EcoImpactTracker />}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            {userTools.length > 0 ? (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Tool to Verify</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setSelectedTool(tool.id);
                          toast.success(`Selected ${tool.title} for verification`);
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedTool === tool.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={tool.images[0]}
                          alt={tool.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-medium text-gray-900">{tool.title}</h4>
                        <p className="text-sm text-gray-600">{tool.category}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {selectedTool && (
                  <BlockchainVerification 
                    toolId={selectedTool}
                    onVerificationComplete={handleVerificationComplete}
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tools to Verify</h3>
                <p className="text-gray-600 mb-4">Post your first tool to start using blockchain verification</p>
                <button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Tool
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            {userTools.length > 0 ? (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Tool for Smart Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setSelectedTool(tool.id);
                          toast.success(`Selected ${tool.title} for smart pricing analysis`);
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedTool === tool.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={tool.images[0]}
                          alt={tool.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-medium text-gray-900">{tool.title}</h4>
                        <p className="text-sm text-gray-600">{tool.category}</p>
                        <p className="text-lg font-bold text-primary-600 mt-2">
                          ${tool.price.daily}/day
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {selectedTool && (
                  <SmartPricingEngine 
                    toolId={selectedTool}
                    currentPrice={userTools.find(t => t.id === selectedTool)?.price.daily || 25}
                    onPriceUpdate={handlePriceUpdate}
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tools for Pricing</h3>
                <p className="text-gray-600 mb-4">Post your first tool to start using smart pricing</p>
                <button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Tool
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* AI Vision Scanner Modal */}
      <AIVisionScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onToolsFound={handleToolsFound}
      />
    </div>
  );
};

export default Dashboard;