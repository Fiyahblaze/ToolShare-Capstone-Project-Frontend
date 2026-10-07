import React, { useState } from 'react';
import { Sparkles, Send, Scan, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIVisionScanner from './AIVisionScanner';

interface AIAssistantProps {
  onSuggestion: (suggestion: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onSuggestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI suggestions based on query
    const suggestions = generateSuggestions(query);
    onSuggestion(suggestions);
    
    setIsLoading(false);
    setQuery('');
    setIsOpen(false);
  };

  const generateSuggestions = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('leak') || lowerQuery.includes('pipe')) {
      return "🔧 For pipe leaks, you'll need: Pipe wrench ($15/day), Plumber's tape ($5/day), Pipe cutter ($20/day). I found 3 verified owners within 2 miles. Estimated project cost: $40 vs $200+ for new tools!";
    }
    
    if (lowerQuery.includes('paint') || lowerQuery.includes('wall')) {
      return "🎨 For painting projects: Paint sprayer ($35/day - saves 70% time!), Professional brushes ($8/day), Drop cloths ($5/day). Pro tip: Rent a sprayer for rooms >200 sq ft. 5 available nearby with same-day pickup!";
    }
    
    if (lowerQuery.includes('garden') || lowerQuery.includes('lawn')) {
      return "🌱 Perfect timing for garden work! Lawn mower ($25/day), Hedge trimmer ($18/day), Leaf blower ($15/day). Spring demand is high - book now! Your eco-impact: Sharing vs buying saves 156kg CO₂.";
    }
    
    if (lowerQuery.includes('deck') || lowerQuery.includes('build')) {
      return "🏗️ Deck building detected! You'll need: Circular saw ($30/day), Drill set ($12/day), Level ($8/day), Measuring tools ($5/day). Total: $55/day vs $800+ to buy. I found a complete deck-building kit from Mike (4.9⭐) - one-stop rental!";
    }
    
    return "🤖 I analyzed your request and found several tool options nearby. Use our AI Vision Scanner to point your camera at your project for instant, personalized recommendations with exact tool matches!";
  };

  const handleCameraCapture = () => {
    setShowScanner(true);
    setIsOpen(false);
  };

  const handleToolsFound = (analysis: string) => {
    onSuggestion(analysis);
    setShowScanner(false);
  };

  return (
    <>
      {/* AI Assistant Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-full shadow-lg z-40 hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-t-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-full mr-3">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">AI Tool Assistant</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                Describe your project or scan it with AI Vision for instant tool recommendations!
              </p>

              <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What do you need to fix or build?"
                    className="flex-1 input-field"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="btn-primary px-3"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCameraCapture}
                  disabled={isLoading}
                  className="btn-primary flex items-center justify-center py-3"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  AI Vision Scan
                </button>
                <button
                  onClick={() => onSuggestion("🔥 Trending in your area: Power drill ($20/day), Lawn mower ($25/day), Paint sprayer ($35/day), Pressure washer ($30/day). All verified owners with 4.8+ ratings!")}
                  className="btn-outline flex items-center justify-center py-3"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Trending Tools
                </button>
              </div>

              {isLoading && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">AI analyzing...</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Vision Scanner */}
      <AIVisionScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onToolsFound={handleToolsFound}
      />
    </>
  );
};

export default AIAssistant;