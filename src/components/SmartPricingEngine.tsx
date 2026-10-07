import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Zap, Calendar, Target, AlertCircle, Settings, RefreshCw, Eye, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useToolStore } from '../store/toolStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface SmartPricingEngineProps {
  toolId: string;
  currentPrice: number;
  onPriceUpdate: (newPrice: number) => void;
}

interface PriceHistoryDataPoint {
  date: string;
  price: number;
  bookings: number;
  revenue: number;
}

const SmartPricingEngine: React.FC<SmartPricingEngineProps> = ({ 
  toolId, 
  currentPrice, 
  onPriceUpdate 
}) => {
  const { tools, updateTool } = useToolStore();
  const { user: _user } = useAuthStore();
  const [priceRecommendation, setPriceRecommendation] = useState<number>(currentPrice);
  const [demandForecast, setDemandForecast] = useState<any[]>([]);
  const [marketInsights, setMarketInsights] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoPricingEnabled, setAutoPricingEnabled] = useState(false);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryDataPoint[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('week');

  const tool = tools.find(t => t.id === toolId);

  useEffect(() => {
    analyzePricing();
    generatePriceHistory();
  }, [toolId, selectedTimeframe]);

  const analyzePricing = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI pricing analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate dynamic demand forecast based on tool category and season
    const baseMultiplier = tool?.category === 'Garden Tools' ? 1.3 : 
                          tool?.category === 'Power Tools' ? 1.1 : 1.0;
    
    const forecast = [
      { day: 'Mon', demand: Math.floor((65 + Math.random() * 20) * baseMultiplier), price: currentPrice, revenue: 0 },
      { day: 'Tue', demand: Math.floor((45 + Math.random() * 15) * baseMultiplier), price: currentPrice, revenue: 0 },
      { day: 'Wed', demand: Math.floor((55 + Math.random() * 18) * baseMultiplier), price: currentPrice, revenue: 0 },
      { day: 'Thu', demand: Math.floor((70 + Math.random() * 22) * baseMultiplier), price: currentPrice, revenue: 0 },
      { day: 'Fri', demand: Math.floor((85 + Math.random() * 25) * baseMultiplier), price: currentPrice * 1.1, revenue: 0 },
      { day: 'Sat', demand: Math.floor((95 + Math.random() * 30) * baseMultiplier), price: currentPrice * 1.2, revenue: 0 },
      { day: 'Sun', demand: Math.floor((90 + Math.random() * 28) * baseMultiplier), price: currentPrice * 1.15, revenue: 0 },
    ];

    // Calculate potential revenue
    forecast.forEach(day => {
      day.revenue = Math.floor((day.demand / 100) * day.price * 0.8); // 80% booking rate
    });

    // Generate market insights with dynamic data
    const seasonalBonus = new Date().getMonth() >= 2 && new Date().getMonth() <= 5 ? 1.2 : 1.0;
    const insights = {
      optimalPrice: Math.round(currentPrice * 1.15 * seasonalBonus),
      demandTrend: Math.random() > 0.3 ? 'increasing' : 'stable',
      competitorAverage: Math.round(currentPrice * (0.9 + Math.random() * 0.4)),
      seasonalMultiplier: seasonalBonus,
      weatherImpact: Math.random() > 0.5 ? 'positive' : 'neutral',
      marketScore: Math.floor(70 + Math.random() * 25),
      events: [
        { 
          type: 'weather', 
          description: 'Sunny weekend forecast', 
          impact: '+15%',
          confidence: Math.floor(80 + Math.random() * 15)
        },
        { 
          type: 'seasonal', 
          description: 'Spring gardening season', 
          impact: '+20%',
          confidence: Math.floor(85 + Math.random() * 10)
        },
        {
          type: 'local',
          description: 'Home improvement expo nearby',
          impact: '+10%',
          confidence: Math.floor(70 + Math.random() * 20)
        }
      ]
    };

    setDemandForecast(forecast);
    setMarketInsights(insights);
    setPriceRecommendation(insights.optimalPrice);
    setIsAnalyzing(false);
    
    toast.success('AI pricing analysis complete!');
  };

  const generatePriceHistory = () => {
    const days = selectedTimeframe === 'week' ? 7 : selectedTimeframe === 'month' ? 30 : 90;
    const history: PriceHistoryDataPoint[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const basePrice = currentPrice;
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const price = Math.round(basePrice * (1 + variation));
      
      history.push({
        date: date.toLocaleDateString(),
        price,
        bookings: Math.floor(Math.random() * 5),
        revenue: price * Math.floor(Math.random() * 3)
      });
    }
    
    setPriceHistory(history);
  };

  const applyRecommendation = () => {
    onPriceUpdate(priceRecommendation);
    
    // Update the tool in the store
    if (tool) {
      updateTool(toolId, {
        price: {
          ...tool.price,
          daily: priceRecommendation
        }
      });
    }
    
    toast.success(`Price updated to $${priceRecommendation}/day!`);
  };

  const toggleAutoPricing = () => {
    setAutoPricingEnabled(!autoPricingEnabled);
    toast.success(
      autoPricingEnabled 
        ? 'Auto-pricing disabled. Manual control restored.' 
        : 'Auto-pricing enabled! AI will optimize your rates automatically.'
    );
  };

  const refreshAnalysis = () => {
    toast.success('Refreshing market analysis...');
    analyzePricing();
  };

  const viewDetailedAnalytics = () => {
    toast.success('Opening detailed pricing analytics...');
  };

  const testPricePoint = (testPrice: number) => {
    const impact = ((testPrice - currentPrice) / currentPrice) * 100;
    const demandChange = impact > 0 ? -impact * 0.5 : -impact * 0.3; // Demand decreases with higher prices
    
    toast.success(
      `Test price $${testPrice}: ${impact > 0 ? '+' : ''}${impact.toFixed(1)}% price change, ${demandChange > 0 ? '+' : ''}${demandChange.toFixed(1)}% demand impact`
    );
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing market conditions...</p>
            <p className="text-sm text-gray-500 mt-2">Processing demand patterns, competitor pricing, and seasonal trends</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-full mr-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Smart Pricing Recommendation</h3>
              <p className="text-sm text-gray-600">AI-optimized for maximum earnings</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshAnalysis}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Refresh analysis"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={viewDetailedAnalytics}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="View detailed analytics"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">${priceRecommendation}</p>
            <p className="text-sm text-gray-600">Recommended Price</p>
            <p className="text-xs text-green-700">
              {priceRecommendation > currentPrice ? '+' : ''}
              {Math.round(((priceRecommendation - currentPrice) / currentPrice) * 100)}% vs current
            </p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <p className="text-lg font-semibold text-gray-900">
              ${Math.round(priceRecommendation * 4.5)}
            </p>
            <p className="text-sm text-gray-600">Potential Weekly</p>
            <p className="text-xs text-blue-600">+${Math.round((priceRecommendation - currentPrice) * 4.5)} increase</p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <p className="text-lg font-semibold text-gray-900">
              {marketInsights?.marketScore || 85}/100
            </p>
            <p className="text-sm text-gray-600">Market Score</p>
            <p className="text-xs text-purple-600">
              {marketInsights?.demandTrend === 'increasing' ? 'Rising demand' : 'Stable demand'}
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={applyRecommendation}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Apply Recommended Price
          </button>
          <button
            onClick={() => testPricePoint(priceRecommendation)}
            className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            Test Impact
          </button>
        </div>
      </motion.div>

      {/* Price History and Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <TrendingDown className="h-5 w-5 mr-2 text-blue-600" />
              Price History
            </h3>
            <div className="flex space-x-2">
              {(['week', 'month', 'quarter'] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => {
                    setSelectedTimeframe(timeframe);
                    generatePriceHistory();
                    toast.success(`Viewing ${timeframe}ly price history`);
                  }}
                  className={`px-3 py-1 text-xs rounded ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Demand Forecast */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
            7-Day Demand Forecast
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={demandForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'demand' ? `${value}%` : `$${value}`,
                name === 'demand' ? 'Demand' : 'Revenue'
              ]} />
              <Area type="monotone" dataKey="demand" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Market Insights */}
      {marketInsights && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary-600" />
            Market Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => toast.success(`Competitor average: $${marketInsights.competitorAverage}. You're ${currentPrice > marketInsights.competitorAverage ? 'above' : 'below'} market rate.`)}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <p className="text-sm text-gray-600">Competitor Average</p>
              <p className="text-xl font-semibold text-gray-900">${marketInsights.competitorAverage}</p>
              <p className={`text-xs ${currentPrice > marketInsights.competitorAverage ? 'text-green-600' : 'text-red-600'}`}>
                {currentPrice > marketInsights.competitorAverage ? 'Above' : 'Below'} market
              </p>
            </button>
            
            <button
              onClick={() => toast.success(`Seasonal multiplier: ${marketInsights.seasonalMultiplier}x. ${marketInsights.seasonalMultiplier > 1 ? 'Peak season pricing opportunity!' : 'Standard season rates.'}`)}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <p className="text-sm text-gray-600">Seasonal Multiplier</p>
              <p className="text-xl font-semibold text-gray-900">{marketInsights.seasonalMultiplier}x</p>
              <p className={`text-xs ${marketInsights.seasonalMultiplier > 1 ? 'text-green-600' : 'text-gray-600'}`}>
                {marketInsights.seasonalMultiplier > 1 ? 'Peak season' : 'Standard season'}
              </p>
            </button>
            
            <button
              onClick={() => toast.success(`Market score: ${marketInsights.marketScore}/100. ${marketInsights.marketScore > 80 ? 'Excellent market conditions!' : 'Good market conditions.'}`)}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <p className="text-sm text-gray-600">Market Score</p>
              <p className="text-xl font-semibold text-gray-900">{marketInsights.marketScore}/100</p>
              <p className={`text-xs ${marketInsights.marketScore > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                {marketInsights.marketScore > 80 ? 'Excellent' : 'Good'} conditions
              </p>
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Market Events & Trends</h4>
            {marketInsights.events.map((event: any, index: number) => (
              <button
                key={index}
                onClick={() => toast.success(`${event.description}: ${event.impact} impact with ${event.confidence}% confidence`)}
                className="w-full flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <AlertCircle className="h-4 w-4 text-blue-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-xs text-gray-600">Expected impact: {event.impact}</p>
                    <p className="text-xs text-blue-600">Confidence: {event.confidence}%</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Auto-Pricing Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Auto-Pricing Mode
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Let AI automatically adjust your prices based on demand, weather, and market conditions
            </p>
            {autoPricingEnabled && (
              <p className="text-xs text-green-600 mt-2">
                ✓ Active: Prices will be optimized every 6 hours
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => toast.success('Opening auto-pricing settings...')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Configure auto-pricing"
            >
              <Settings className="h-4 w-4" />
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={autoPricingEnabled}
                onChange={toggleAutoPricing}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Quick Price Test */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Price Testing</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            currentPrice * 0.9,
            currentPrice,
            currentPrice * 1.1,
            currentPrice * 1.2
          ].map((testPrice, index) => (
            <button
              key={index}
              onClick={() => testPricePoint(Math.round(testPrice))}
              className={`p-3 rounded-lg border transition-colors ${
                Math.round(testPrice) === priceRecommendation
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <p className="font-semibold">${Math.round(testPrice)}</p>
              <p className="text-xs text-gray-600">
                {index === 0 && 'Conservative'}
                {index === 1 && 'Current'}
                {index === 2 && 'Optimistic'}
                {index === 3 && 'Premium'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartPricingEngine;