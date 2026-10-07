import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Grid3X3, 
  List, 
  Filter, 
  Star, 
  MapPin, 
  DollarSign, 
  Clock, 
  Shield,
  Truck,
  Zap,
  Award,
  ChevronDown,
  ChevronRight,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { useToolStore } from '../store/toolStore';
import ToolCard from './ToolCard';
import toast from 'react-hot-toast';

interface ToolBrowserProps {
  tools: any[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ToolBrowser: React.FC<ToolBrowserProps> = ({ tools, viewMode, onViewModeChange }) => {
  const { setSelectedCategory, selectedCategory } = useToolStore();
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating' | 'distance' | 'newest'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Power Tools']);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const categories = [
    {
      name: 'Power Tools',
      icon: '⚡',
      subcategories: ['Drills', 'Saws', 'Sanders', 'Grinders', 'Nail Guns', 'Impact Drivers'],
      count: 45
    },
    {
      name: 'Garden Tools',
      icon: '🌱',
      subcategories: ['Lawn Mowers', 'Trimmers', 'Leaf Blowers', 'Chainsaws', 'Hedge Trimmers', 'Pressure Washers'],
      count: 32
    },
    {
      name: 'Beauty Tools',
      icon: '💄',
      subcategories: ['Hair Dryers', 'Curling Irons', 'Straighteners', 'Makeup Tools', 'Nail Tools'],
      count: 18
    },
    {
      name: 'Automotive',
      icon: '🚗',
      subcategories: ['Jacks', 'Wrenches', 'Diagnostic Tools', 'Tire Tools', 'Battery Chargers'],
      count: 24
    },
    {
      name: 'Construction',
      icon: '🏗️',
      subcategories: ['Ladders', 'Scaffolding', 'Concrete Tools', 'Measuring Tools', 'Safety Equipment'],
      count: 38
    },
    {
      name: 'Painting',
      icon: '🎨',
      subcategories: ['Paint Sprayers', 'Brushes', 'Rollers', 'Drop Cloths', 'Ladders'],
      count: 15
    },
    {
      name: 'Cleaning',
      icon: '🧽',
      subcategories: ['Vacuum Cleaners', 'Steam Cleaners', 'Carpet Cleaners', 'Window Tools'],
      count: 12
    }
  ];

  const features = [
    { id: 'instant_booking', label: 'Instant Booking', icon: Zap },
    { id: 'delivery', label: 'Delivery Available', icon: Truck },
    { id: 'insurance', label: 'Insurance Included', icon: Shield },
    { id: 'verified_owner', label: 'Verified Owner', icon: Award },
    { id: 'video_tutorial', label: 'Video Tutorial', icon: Clock }
  ];

  const conditions = ['excellent', 'good', 'fair'];
  const brands = ['DeWalt', 'Makita', 'Milwaukee', 'Bosch', 'Ryobi', 'Black & Decker', 'Craftsman'];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'newest', label: 'Newest First' }
  ];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName === selectedCategory ? '' : categoryName);
    toast.success(`${categoryName === selectedCategory ? 'Cleared' : 'Selected'} ${categoryName}`);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategories([]);
    setPriceRange([0, 500]);
    setSelectedFeatures([]);
    setSelectedConditions([]);
    setSelectedBrands([]);
    setSortBy('relevance');
    toast.success('All filters cleared');
  };

  const getFilteredAndSortedTools = () => {
    let filtered = [...tools];

    // Apply filters
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(tool => 
        selectedSubcategories.includes(tool.subcategory || '')
      );
    }

    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(tool => {
        return selectedFeatures.every(feature => {
          switch (feature) {
            case 'instant_booking':
              return tool.features?.instantBooking;
            case 'delivery':
              return tool.delivery?.available;
            case 'insurance':
              return tool.features?.insurance;
            case 'verified_owner':
              return tool.owner?.verified;
            case 'video_tutorial':
              return tool.features?.videoTutorial;
            default:
              return false;
          }
        });
      });
    }

    if (selectedConditions.length > 0) {
      filtered = filtered.filter(tool => 
        selectedConditions.includes(tool.condition || '')
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(tool => 
        selectedBrands.includes(tool.brand || '')
      );
    }

    filtered = filtered.filter(tool => 
      tool.price.daily >= priceRange[0] && tool.price.daily <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price.daily - b.price.daily);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price.daily - a.price.daily);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'distance':
        // Mock distance sorting
        filtered.sort(() => Math.random() - 0.5);
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return filtered;
  };

  const filteredTools = getFilteredAndSortedTools();
  const activeFiltersCount = selectedSubcategories.length + selectedFeatures.length + 
                           selectedConditions.length + selectedBrands.length + 
                           (selectedCategory ? 1 : 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Filters */}
      <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleCategorySelect(category.name)}
                        className={`flex items-center flex-1 p-2 rounded-lg transition-colors ${
                          selectedCategory === category.name
                            ? 'bg-primary-50 text-primary-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg mr-2">{category.icon}</span>
                        <span className="text-sm font-medium flex-1 text-left">{category.name}</span>
                        <span className="text-xs text-gray-500 mr-2">{category.count}</span>
                      </button>
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {expandedCategories.includes(category.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    {expandedCategories.includes(category.name) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 mt-2 space-y-1"
                      >
                        {category.subcategories.map((sub) => (
                          <label key={sub} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedSubcategories.includes(sub)}
                              onChange={() => handleSubcategoryToggle(sub)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{sub}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Daily Price Range</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Max"
                  />
                </div>
                <div className="text-xs text-gray-600">
                  ${priceRange[0]} - ${priceRange[1]} per day
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Features</h4>
              <div className="space-y-2">
                {features.map((feature) => (
                  <label key={feature.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <feature.icon className="h-4 w-4 ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Condition</h4>
              <div className="space-y-2">
                {conditions.map((condition) => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition)}
                      onChange={() => handleConditionToggle(condition)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-outline flex items-center"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              <div className="text-sm text-gray-600">
                {filteredTools.length} tools found
                {selectedCategory && (
                  <span className="ml-2 text-primary-600">in {selectedCategory}</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`px-3 py-2 text-sm flex items-center ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Grid
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`px-3 py-2 text-sm flex items-center ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedSubcategories.map((sub) => (
                  <span key={sub} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {sub}
                    <button
                      onClick={() => handleSubcategoryToggle(sub)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedFeatures.map((feature) => (
                  <span key={feature} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {features.find(f => f.id === feature)?.label}
                    <button
                      onClick={() => handleFeatureToggle(feature)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={clearAllFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredTools.length > 0 && filteredTools.length >= 12 && (
          <div className="text-center mt-8">
            <button
              onClick={() => toast.success('Loading more tools...')}
              className="btn-outline"
            >
              Load More Tools
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolBrowser;