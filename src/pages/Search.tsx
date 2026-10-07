import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, MapPin, SlidersHorizontal, Grid3X3, List, Map } from 'lucide-react';
import { useToolStore } from '../store/toolStore';
import ToolCard from '../components/ToolCard';
import SearchFilters from '../components/SearchFilters';
import ToolBrowser from '../components/ToolBrowser';
import AIAssistant from '../components/AIAssistant';
import InteractiveMap from '../components/InteractiveMap';
import toast from 'react-hot-toast';

const Search: React.FC = () => {
  const { searchQuery, setSearchQuery, getFilteredTools } = useToolStore();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map' | 'browse'>('browse');

  const filteredTools = getFilteredTools();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    toast.success(`Found ${filteredTools.length} tools`);
  };

  const handleAISuggestion = (suggestion: string) => {
    toast.success('AI suggestions applied to search!');
  };

  const handleToolSelect = (tool: any) => {
    // This would typically navigate to the tool details page
    toast.success(`Viewing ${tool.title}`);
  };

  const handleViewModeChange = (mode: 'grid' | 'list' | 'map' | 'browse') => {
    setViewMode(mode);
    toast.success(`Switched to ${mode} view`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Tools</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for tools, categories, or describe your project..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>
        </form>

        {/* Search Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </button>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">San Francisco, CA</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredTools.length} tools found
            </span>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleViewModeChange('browse')}
                className={`px-3 py-2 text-sm flex items-center ${
                  viewMode === 'browse'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Browse view"
              >
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Browse
              </button>
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`px-3 py-2 text-sm flex items-center ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Grid view"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`px-3 py-2 text-sm flex items-center ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="List view"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </button>
              <button
                onClick={() => handleViewModeChange('map')}
                className={`px-3 py-2 text-sm flex items-center ${
                  viewMode === 'map'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Map view"
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Legacy Filters (only show when not in browse mode) */}
      {showFilters && viewMode !== 'browse' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <SearchFilters />
        </motion.div>
      )}

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse our categories
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchInput('');
                handleViewModeChange('browse');
              }}
              className="btn-primary"
            >
              Browse All Tools
            </button>
          </div>
        ) : viewMode === 'browse' ? (
          <ToolBrowser 
            tools={filteredTools}
            viewMode="grid"
            onViewModeChange={(mode) => setViewMode(mode)}
          />
        ) : viewMode === 'map' ? (
          <InteractiveMap 
            tools={filteredTools} 
            onToolSelect={handleToolSelect}
          />
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {filteredTools.map((tool, index) => (
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

      {/* AI Assistant */}
      <AIAssistant onSuggestion={handleAISuggestion} />
    </div>
  );
};

export default Search;