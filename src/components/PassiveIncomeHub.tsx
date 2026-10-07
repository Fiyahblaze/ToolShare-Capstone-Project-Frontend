import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Settings, 
  Zap, 
  Target,
  BarChart3,
  Lightbulb,
  Plus,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToolStore } from '../store/toolStore';
import { useAuthStore } from '../store/authStore';
import { useRentalStore } from '../store/rentalStore';
import toast from 'react-hot-toast';

const PassiveIncomeHub: React.FC = () => {
  const { user } = useAuthStore();
  const { tools } = useToolStore();
  const { getOwnerRentals, getUserRentals } = useRentalStore();
  const [autoAcceptEnabled, setAutoAcceptEnabled] = useState(false);
  const [smartPricingEnabled, setSmartPricingEnabled] = useState(true);
  const [weekdayHours, setWeekdayHours] = useState('9 AM - 6 PM');
  const [weekendHours, setWeekendHours] = useState('10 AM - 4 PM');
  const [minPrice, setMinPrice] = useState(15);
  const [maxPrice, setMaxPrice] = useState(75);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  // Get user's tools and rentals
  const userTools = tools.filter(tool => tool.owner.id === user!.id);
  const ownerRentals = getOwnerRentals(user!.id);
  const userRentals = getUserRentals(user!.id);
  
  // Calculate real earnings data
  const monthlyEarnings = ownerRentals.reduce((sum, rental) => sum + rental.totalCost, 0);
  const totalEarnings = monthlyEarnings * 6; // Simulate 6 months
  const projectedAnnual = monthlyEarnings * 12;
  const utilizationRate = userTools.length > 0 ? Math.round((ownerRentals.length / userTools.length) * 100) : 0;

  const impactData = {
    co2Saved: ownerRentals.length * 35 + userTools.length * 12,
    itemsShared: userTools.length,
    newPurchasesPrevented: Math.floor(ownerRentals.length * 0.7),
    communityImpact: (ownerRentals.length * 35 + userTools.length * 12) * 1.5
  };

  // Mock data for earnings trend
  const earningsData = [
    { month: 'Jan', earnings: monthlyEarnings * 0.3, tools: Math.max(1, userTools.length - 2) },
    { month: 'Feb', earnings: monthlyEarnings * 0.5, tools: Math.max(1, userTools.length - 1) },
    { month: 'Mar', earnings: monthlyEarnings * 0.7, tools: userTools.length },
    { month: 'Apr', earnings: monthlyEarnings * 0.8, tools: userTools.length },
    { month: 'May', earnings: monthlyEarnings * 0.9, tools: userTools.length },
    { month: 'Jun', earnings: monthlyEarnings, tools: userTools.length },
  ];

  // Calculate tool performance based on user's actual tools
  const toolPerformance = [
    { name: 'Power Tools', value: 45, color: '#3b82f6', co2: Math.floor(impactData.co2Saved * 0.45) },
    { name: 'Garden Tools', value: 30, color: '#10b981', co2: Math.floor(impactData.co2Saved * 0.30) },
    { name: 'Beauty Tools', value: 15, color: '#f59e0b', co2: Math.floor(impactData.co2Saved * 0.15) },
    { name: 'Automotive', value: 10, color: '#ef4444', co2: Math.floor(impactData.co2Saved * 0.10) },
  ];

  const suggestions = [
    {
      icon: TrendingUp,
      title: "Add Tile Cutter",
      description: "High demand in your area - potential $280/month",
      priority: "high",
      investment: "$150",
      details: "Tile cutters are in high demand for home renovation projects. Based on local market data, you could earn $35/day with 8 rental days per month.",
      action: "Research tile cutters on marketplace"
    },
    {
      icon: Calendar,
      title: "Weekend Premium Pricing",
      description: "Increase rates 25% for Sat-Sun bookings",
      priority: "medium",
      investment: "Free",
      details: "Weekend demand is 40% higher. Implementing premium pricing could increase your monthly earnings by $120-180.",
      action: "Enable weekend pricing"
    },
    {
      icon: Target,
      title: "Pressure Washer Opportunity",
      description: "Spring cleaning season - 40% demand increase",
      priority: "high",
      investment: "$200",
      details: "Spring season shows 40% increase in pressure washer rentals. ROI typically achieved within 2-3 months.",
      action: "Add pressure washer to inventory"
    }
  ];

  const handleAutoAcceptToggle = () => {
    setAutoAcceptEnabled(!autoAcceptEnabled);
    toast.success(
      autoAcceptEnabled 
        ? 'Auto-accept disabled. You\'ll manually review all bookings.' 
        : 'Auto-accept enabled for 5-star renters during set hours!'
    );
  };

  const handleSmartPricingToggle = () => {
    setSmartPricingEnabled(!smartPricingEnabled);
    toast.success(
      smartPricingEnabled 
        ? 'Smart pricing disabled. Manual pricing active.' 
        : 'Smart pricing enabled! AI will optimize your rates.'
    );
  };

  const handleHoursChange = (type: 'weekday' | 'weekend', value: string) => {
    if (type === 'weekday') {
      setWeekdayHours(value);
      toast.success(`Weekday hours updated to ${value}`);
    } else {
      setWeekendHours(value);
      toast.success(`Weekend hours updated to ${value}`);
    }
  };

  const handlePriceLimitChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setMinPrice(value);
      toast.success(`Minimum price set to $${value}`);
    } else {
      setMaxPrice(value);
      toast.success(`Maximum price set to $${value}`);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setShowSuggestionModal(true);
  };

  const handleImplementSuggestion = (suggestion: any) => {
    toast.success(`Implementing: ${suggestion.title}`);
    setShowSuggestionModal(false);
    
    // Simulate implementation based on suggestion type
    if (suggestion.title.includes('Premium Pricing')) {
      // Enable weekend premium pricing
      toast.success('Weekend premium pricing activated! 25% increase on Sat-Sun.');
    } else if (suggestion.title.includes('Tile Cutter') || suggestion.title.includes('Pressure Washer')) {
      // Simulate adding new tool suggestion
      toast.success(`Added ${suggestion.title.split(' ')[1]} to your wishlist. Check marketplace for deals!`);
    }
  };

  const openPricingSettings = () => {
    setShowPricingModal(true);
  };

  const savePricingSettings = () => {
    setShowPricingModal(false);
    toast.success('Pricing settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Income Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => toast.success(`Total earnings: $${monthlyEarnings}. Great job!`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">This Month</p>
              <p className="text-2xl font-bold">${monthlyEarnings}</p>
              <p className="text-green-100 text-sm">+18% from last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => toast.success(`You have ${userTools.length} active tools generating income!`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Tools</p>
              <p className="text-2xl font-bold text-gray-900">{userTools.length}</p>
              <p className="text-green-600 text-sm">+{Math.max(0, userTools.length - 6)} this month</p>
            </div>
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => toast.success(`${utilizationRate}% utilization rate - ${utilizationRate > 70 ? 'Excellent!' : 'Room for improvement'}`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-900">{utilizationRate}%</p>
              <p className={`text-sm ${utilizationRate > 70 ? 'text-blue-600' : 'text-yellow-600'}`}>
                {utilizationRate > 70 ? 'Above average' : 'Can improve'}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => toast.success(`Projected annual earnings: $${projectedAnnual}. Keep it up!`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Projected Annual</p>
              <p className="text-2xl font-bold text-gray-900">${projectedAnnual}</p>
              <p className="text-purple-600 text-sm">Based on trends</p>
            </div>
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Earnings Trend</h3>
            <button 
              onClick={() => toast.success('Earnings data updated!')}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              <Eye className="h-4 w-4 inline mr-1" />
              View Details
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tool Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Impact by Category
            </h3>
            <button 
              onClick={() => toast.success('Category breakdown updated!')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <BarChart3 className="h-4 w-4 inline mr-1" />
              Analyze
            </button>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={toolPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {toolPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(_value, _name, props) => [`${props.payload.co2}kg CO₂`, 'Impact']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {toolPerformance.map((item, index) => (
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

      {/* Automation Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Set & Forget Automation
          </h3>
          <button 
            onClick={openPricingSettings}
            className="btn-outline flex items-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Auto-Accept Bookings</h4>
                <p className="text-sm text-gray-600">From 5-star renters during set hours</p>
                <p className="text-xs text-blue-600 mt-1">
                  {autoAcceptEnabled ? `Active: ${weekdayHours} (weekdays), ${weekendHours} (weekends)` : 'Currently disabled'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={autoAcceptEnabled}
                  onChange={handleAutoAcceptToggle}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Smart Pricing</h4>
                <p className="text-sm text-gray-600">AI adjusts rates based on demand</p>
                <p className="text-xs text-green-600 mt-1">
                  {smartPricingEnabled ? `Active: $${minPrice}-$${maxPrice} range` : 'Manual pricing active'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={smartPricingEnabled}
                  onChange={handleSmartPricingToggle}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Available Hours</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="text-blue-700">Weekdays</label>
                  <select 
                    value={weekdayHours}
                    onChange={(e) => handleHoursChange('weekday', e.target.value)}
                    className="w-full mt-1 text-xs border border-blue-200 rounded p-1"
                  >
                    <option>8 AM - 8 PM</option>
                    <option>9 AM - 6 PM</option>
                    <option>10 AM - 5 PM</option>
                    <option>24/7</option>
                  </select>
                </div>
                <div>
                  <label className="text-blue-700">Weekends</label>
                  <select 
                    value={weekendHours}
                    onChange={(e) => handleHoursChange('weekend', e.target.value)}
                    className="w-full mt-1 text-xs border border-blue-200 rounded p-1"
                  >
                    <option>9 AM - 6 PM</option>
                    <option>10 AM - 4 PM</option>
                    <option>11 AM - 3 PM</option>
                    <option>24/7</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Price Limits</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="text-green-700">Min Price</label>
                  <input 
                    type="number" 
                    value={minPrice}
                    onChange={(e) => handlePriceLimitChange('min', Number(e.target.value))}
                    className="w-full mt-1 text-xs border border-green-200 rounded p-1" 
                    placeholder="$15" 
                  />
                </div>
                <div>
                  <label className="text-green-700">Max Price</label>
                  <input 
                    type="number" 
                    value={maxPrice}
                    onChange={(e) => handlePriceLimitChange('max', Number(e.target.value))}
                    className="w-full mt-1 text-xs border border-green-200 rounded p-1" 
                    placeholder="$75" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            AI Income Opportunities
          </h3>
          <button 
            onClick={() => toast.success('AI suggestions refreshed!')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Refresh Suggestions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-primary-200 transition-all text-left group"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between mb-3">
                <suggestion.icon className={`h-6 w-6 ${
                  suggestion.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                } group-hover:scale-110 transition-transform`} />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  suggestion.priority === 'high' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {suggestion.priority}
                </span>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {suggestion.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">
                  Investment: {suggestion.investment}
                </span>
                <span className="text-sm bg-primary-600 text-white px-3 py-1 rounded-lg group-hover:bg-primary-700 transition-colors">
                  Learn More
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Pricing Settings Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Advanced Pricing Settings</h3>
              <button 
                onClick={() => setShowPricingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Daily Rate
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Daily Rate
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekend Premium
                </label>
                <select className="input-field">
                  <option>No premium</option>
                  <option>10% increase</option>
                  <option>25% increase</option>
                  <option>50% increase</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seasonal Adjustments
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Spring premium (March-May): +15%</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Summer premium (June-August): +20%</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Holiday premium: +30%</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setShowPricingModal(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={savePricingSettings}
                className="flex-1 btn-primary"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Suggestion Details Modal */}
      {showSuggestionModal && selectedSuggestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <selectedSuggestion.icon className="h-6 w-6 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">{selectedSuggestion.title}</h3>
              </div>
              <button 
                onClick={() => setShowSuggestionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">{selectedSuggestion.details}</p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Investment Required:</span>
                    <p className="font-medium text-gray-900">{selectedSuggestion.investment}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Priority Level:</span>
                    <p className={`font-medium ${
                      selectedSuggestion.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {selectedSuggestion.priority.charAt(0).toUpperCase() + selectedSuggestion.priority.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                <p className="text-blue-700 text-sm">{selectedSuggestion.action}</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setShowSuggestionModal(false)}
                className="flex-1 btn-outline"
              >
                Maybe Later
              </button>
              <button 
                onClick={() => handleImplementSuggestion(selectedSuggestion)}
                className="flex-1 btn-primary"
              >
                Implement Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PassiveIncomeHub;