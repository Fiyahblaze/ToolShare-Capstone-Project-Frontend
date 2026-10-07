import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Heart, Share2, Shield, Truck, Zap } from 'lucide-react';
import { Tool } from '../store/toolStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Added ${tool.title} to favorites!`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: tool.title,
        text: tool.description,
        url: window.location.origin + `/tool/${tool.id}`,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.origin + `/tool/${tool.id}`);
        toast.success('Link copied to clipboard!');
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin + `/tool/${tool.id}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Link to={`/tool/${tool.id}`} className="block group">
      <motion.div 
        className="tool-card"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={tool.images[0]}
            alt={tool.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-900">
              ${tool.price.daily}/day
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleFavorite}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              title="Add to favorites"
            >
              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
            </button>
            <button
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              title="Share tool"
            >
              <Share2 className="h-4 w-4 text-gray-600 hover:text-blue-500 transition-colors" />
            </button>
          </div>
          
          {/* Availability Status */}
          {!tool.availability.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Not Available
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-primary-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
              {tool.category}
            </span>
          </div>

          {/* Features Badges */}
          <div className="absolute bottom-3 right-3 flex space-x-1">
            {tool.features?.instantBooking && (
              <div className="bg-green-500/90 backdrop-blur-sm text-white p-1 rounded-full" title="Instant Booking">
                <Zap className="h-3 w-3" />
              </div>
            )}
            {tool.delivery?.available && (
              <div className="bg-blue-500/90 backdrop-blur-sm text-white p-1 rounded-full" title="Delivery Available">
                <Truck className="h-3 w-3" />
              </div>
            )}
            {tool.owner.verified && (
              <div className="bg-purple-500/90 backdrop-blur-sm text-white p-1 rounded-full" title="Verified Owner">
                <Shield className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-primary-600 transition-colors">
              {tool.title}
            </h3>
          </div>

          {/* Brand and Model */}
          {(tool.brand || tool.model) && (
            <div className="flex items-center space-x-2 mb-2">
              {tool.brand && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {tool.brand}
                </span>
              )}
              {tool.model && (
                <span className="text-xs text-gray-600">{tool.model}</span>
              )}
              {tool.condition && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tool.condition === 'excellent' ? 'bg-green-100 text-green-700' :
                  tool.condition === 'good' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {tool.condition}
                </span>
              )}
            </div>
          )}

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {tool.description}
          </p>

          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{tool.location.city}, {tool.location.state}</span>
            {tool.delivery?.available && (
              <span className="ml-2 text-blue-600 text-xs">
                • Delivery available
              </span>
            )}
          </div>

          {/* Owner & Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img
                  src={tool.owner.avatar}
                  alt={tool.owner.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
                {tool.owner.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                    <Shield className="h-2 w-2" />
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-700">{tool.owner.name}</span>
            </div>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-700 ml-1">
                {tool.rating} ({tool.reviewCount})
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                {tool.price.hourly && (
                  <span className="text-gray-600">
                    <Clock className="h-3 w-3 inline mr-1" />
                    ${tool.price.hourly}/hr
                  </span>
                )}
                <span className="font-medium text-gray-900">
                  ${tool.price.daily}/day
                </span>
                {tool.price.weekly && (
                  <span className="text-gray-600">${tool.price.weekly}/wk</span>
                )}
              </div>
              
              {/* Availability Indicator */}
              <div className={`flex items-center text-xs ${
                tool.availability.available ? 'text-green-600' : 'text-red-600'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  tool.availability.available ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {tool.availability.available ? 'Available' : 'Unavailable'}
              </div>
            </div>

            {/* Additional Features */}
            {(tool.features?.instantBooking || tool.features?.insurance || tool.features?.videoTutorial) && (
              <div className="flex items-center space-x-2 mt-2">
                {tool.features.instantBooking && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Instant
                  </span>
                )}
                {tool.features.insurance && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Insured
                  </span>
                )}
                {tool.features.videoTutorial && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Tutorial
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ToolCard;