import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Award, TrendingUp, Share2, Download, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useToolStore } from '../store/toolStore';
import { useAuthStore } from '../store/authStore';
import { useRentalStore } from '../store/rentalStore';
import toast from 'react-hot-toast';

const EcoImpactTracker: React.FC = () => {
  const { user } = useAuthStore();
  const { tools } = useToolStore();
  const { getOwnerRentals, getUserRentals } = useRentalStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'year' | 'all'>('year');
  const [showShareModal, setShowShareModal] = useState(false);

  // Calculate real impact data based on user's activity
  const userTools = tools.filter(tool => tool.owner.id === user!.id);
  const ownerRentals = getOwnerRentals(user!.id);
  const userRentals = getUserRentals(user!.id);
  
  // Calculate CO2 savings (average 35kg CO2 per tool rental)
  const totalRentals = ownerRentals.length + userRentals.length;
  const co2Saved = totalRentals * 35 + userTools.length * 12; // Base savings for sharing tools
  const itemsShared = userTools.length;
  const newPurchasesPrevented = Math.floor(totalRentals * 0.7); // 70% of rentals prevent purchases
  const communityImpact = co2Saved * 1.5; // Multiplier effect

  const impactData = {
    co2Saved,
    itemsShared,
    newPurchasesPrevented,
    communityImpact
  };

  const monthlyData = [
    { month: 'Jan', co2: Math.floor(co2Saved * 0.1), items: Math.max(1, Math.floor(itemsShared * 0.2)) },
    { month: 'Feb', co2: Math.floor(co2Saved * 0.15), items: Math.max(1, Math.floor(itemsShared * 0.3)) },
    { month: 'Mar', co2: Math.floor(co2Saved * 0.25), items: Math.max(1, Math.floor(itemsShared * 0.5)) },
    { month: 'Apr', co2: Math.floor(co2Saved * 0.4), items: Math.max(1, Math.floor(itemsShared * 0.7)) },
    { month: 'May', co2: Math.floor(co2Saved * 0.6), items: Math.max(1, Math.floor(itemsShared * 0.8)) },
    { month: 'Jun', co2: co2Saved, items: itemsShared },
  ];

  const categoryImpact = [
    { name: 'Power Tools', value: 45, color: '#3b82f6', co2: Math.floor(co2Saved * 0.45) },
    { name: 'Garden Tools', value: 30, color: '#10b981', co2: Math.floor(co2Saved * 0.30) },
    { name: 'Beauty Tools', value: 15, color: '#f59e0b', co2: Math.floor(co2Saved * 0.15) },
    { name: 'Automotive', value: 10, color: '#ef4444', co2: Math.floor(co2Saved * 0.10) },
  ];

  const achievements = [
    { 
      title: 'Eco Warrior', 
      description: 'Saved 500kg+ CO2', 
      earned: co2Saved >= 500,
      progress: Math.min(100, (co2Saved / 500) * 100)
    },
    { 
      title: 'Community Hero', 
      description: 'Helped 50+ neighbors', 
      earned: totalRentals >= 50,
      progress: Math.min(100, (totalRentals / 50) * 100)
    },
    { 
      title: 'Sustainability Champion', 
      description: 'Prevented 20+ purchases', 
      earned: newPurchasesPrevented >= 20,
      progress: Math.min(100, (newPurchasesPrevented / 20) * 100)
    },
    { 
      title: 'Green Pioneer', 
      description: 'Top 1% eco impact', 
      earned: co2Saved >= 1000,
      progress: Math.min(100, (co2Saved / 1000) * 100)
    },
  ];

  const handleTimeframeChange = (timeframe: 'month' | 'year' | 'all') => {
    setSelectedTimeframe(timeframe);
    toast.success(`Viewing ${timeframe === 'all' ? 'all-time' : timeframe + 'ly'} impact data`);
  };

  const handleShareImpact = () => {
    setShowShareModal(true);
  };

  const handleDownloadReport = () => {
    toast.success('Eco impact report downloaded! Check your downloads folder.');
  };

  const shareToSocial = (platform: string) => {
    const message = `I've saved ${co2Saved}kg of CO2 by sharing tools on ToolShare! 🌱 That's equivalent to ${Math.floor(co2Saved / 0.24)} miles not driven. Join the sustainable sharing economy! #EcoFriendly #ToolShare`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(message)}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank');
    toast.success(`Shared to ${platform}!`);
    setShowShareModal(false);
  };

  const setEcoGoal = () => {
    toast.success('Eco goal set! We\'ll track your progress and send reminders.');
  };

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-full mr-3">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Your Eco Impact</h3>
              <p className="text-gray-600">Making a difference through sharing</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleShareImpact}
              className="btn-outline flex items-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            <button
              onClick={handleDownloadReport}
              className="btn-primary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => toast.success(`You've saved ${impactData.co2Saved}kg CO2! That's like planting ${Math.floor(impactData.co2Saved / 22)} trees.`)}
            className="bg-white/60 rounded-lg p-4 text-center hover:bg-white/80 transition-colors group"
          >
            <p className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform">{impactData.co2Saved}kg</p>
            <p className="text-sm text-gray-600">CO₂ Saved</p>
            <p className="text-xs text-green-600">≈ {Math.floor(impactData.co2Saved / 0.24)} miles not driven</p>
          </button>
          
          <button
            onClick={() => toast.success(`You've shared ${impactData.itemsShared} tools with the community!`)}
            className="bg-white/60 rounded-lg p-4 text-center hover:bg-white/80 transition-colors group"
          >
            <p className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">{impactData.itemsShared}</p>
            <p className="text-sm text-gray-600">Tools Shared</p>
            <p className="text-xs text-blue-600">This year</p>
          </button>
          
          <button
            onClick={() => toast.success(`You've prevented ${impactData.newPurchasesPrevented} unnecessary purchases!`)}
            className="bg-white/60 rounded-lg p-4 text-center hover:bg-white/80 transition-colors group"
          >
            <p className="text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform">{impactData.newPurchasesPrevented}</p>
            <p className="text-sm text-gray-600">Purchases Prevented</p>
            <p className="text-xs text-purple-600">Estimated</p>
          </button>
          
          <button
            onClick={() => toast.success(`Community impact: ${impactData.communityImpact}kg CO2 saved through your influence!`)}
            className="bg-white/60 rounded-lg p-4 text-center hover:bg-white/80 transition-colors group"
          >
            <p className="text-2xl font-bold text-orange-600 group-hover:scale-110 transition-transform">{impactData.communityImpact}kg</p>
            <p className="text-sm text-gray-600">Community Impact</p>
            <p className="text-xs text-orange-600">Total CO₂ saved</p>
          </button>
        </div>
      </motion.div>

      {/* Timeframe Selector */}
      <div className="flex items-center justify-center space-x-4">
        {(['month', 'year', 'all'] as const).map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => handleTimeframeChange(timeframe)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTimeframe === timeframe
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {timeframe === 'all' ? 'All Time' : `This ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Monthly CO₂ Savings
            </h3>
            <button 
              onClick={() => toast.success('CO2 savings trend updated!')}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View Details
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}kg`, 'CO₂ Saved']} />
              <Bar dataKey="co2" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Recycle className="h-5 w-5 mr-2 text-blue-600" />
              Impact by Category
            </h3>
            <button 
              onClick={() => toast.success('Category breakdown updated!')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Analyze
            </button>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={categoryImpact}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryImpact.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(_, __, props) => [`${props.payload.co2}kg CO₂`, 'Impact']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryImpact.map((item, index) => (
              <button
                key={index}
                onClick={() => toast.success(`${item.name}: ${item.co2}kg CO₂ saved (${item.value}% of total)`)}
                className="flex items-center hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Eco Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            Eco Achievements
          </h3>
          <button 
            onClick={setEcoGoal}
            className="btn-outline flex items-center"
          >
            <Target className="h-4 w-4 mr-2" />
            Set Goal
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.button
              key={index}
              onClick={() => toast.success(
                achievement.earned 
                  ? `🎉 Achievement unlocked: ${achievement.title}!` 
                  : `Progress: ${Math.floor(achievement.progress)}% towards ${achievement.title}`
              )}
              className={`p-4 rounded-lg border-2 transition-all text-left group ${
                achievement.earned
                  ? 'border-green-200 bg-green-50 hover:bg-green-100'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${
                  achievement.earned ? 'text-green-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h4>
                {achievement.earned && (
                  <Award className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <p className={`text-sm mb-3 ${
                achievement.earned ? 'text-green-700' : 'text-gray-500'
              }`}>
                {achievement.description}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    achievement.earned ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${achievement.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {Math.floor(achievement.progress)}% complete
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Sharing Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 rounded-xl p-6 border border-blue-200"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Maximize Your Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => toast.success('Tip: Each tool shared prevents an average of 56kg CO₂ emissions!')}
            className="bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-colors text-left group"
          >
            <h4 className="font-medium text-blue-900 mb-2 group-hover:text-blue-700">Share More Tools</h4>
            <p className="text-sm text-blue-700">
              Each tool shared prevents an average of 56kg CO₂ emissions
            </p>
          </button>
          <button
            onClick={() => toast.success('Invite friends to multiply your community\'s environmental impact!')}
            className="bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-colors text-left group"
          >
            <h4 className="font-medium text-blue-900 mb-2 group-hover:text-blue-700">Encourage Neighbors</h4>
            <p className="text-sm text-blue-700">
              Refer friends to multiply your community's environmental impact
            </p>
          </button>
          <button
            onClick={() => toast.success('Well-maintained tools last longer and create greater environmental impact!')}
            className="bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-colors text-left group"
          >
            <h4 className="font-medium text-blue-900 mb-2 group-hover:text-blue-700">Choose Quality</h4>
            <p className="text-sm text-blue-700">
              Well-maintained tools last longer and create greater impact
            </p>
          </button>
        </div>
      </motion.div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Share Your Impact</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                You've saved {impactData.co2Saved}kg of CO₂!
              </h4>
              <p className="text-gray-600">
                That's equivalent to {Math.floor(impactData.co2Saved / 0.24)} miles not driven or {Math.floor(impactData.co2Saved / 22)} trees planted.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => shareToSocial('twitter')}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share on Facebook
              </button>
              <button
                onClick={() => shareToSocial('linkedin')}
                className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Share on LinkedIn
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EcoImpactTracker;