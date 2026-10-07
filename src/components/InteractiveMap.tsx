import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Zap, Star, DollarSign } from 'lucide-react';
import { Tool } from '../store/toolStore';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  tools: Tool[];
  onToolSelect?: (tool: Tool) => void;
}

// Component to handle map centering and user location
const MapController: React.FC<{ userLocation: LatLngTuple | null }> = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ tools, onToolSelect }) => {
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Default center (San Francisco)
  const defaultCenter: LatLngTuple = [37.7749, -122.4194];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred';
              break;
          }
          
          setLocationError(errorMessage);
          setUserLocation(defaultCenter);
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000, // Increased from 10000 to 30000 (30 seconds)
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setLocationError('Geolocation is not supported');
      setUserLocation(defaultCenter);
      setIsLoadingLocation(false);
    }
  }, []);

  // Create custom icons for different tool categories
  const createToolIcon = (category: string) => {
    const iconColor = {
      'Power Tools': '#3b82f6',
      'Garden Tools': '#10b981',
      'Beauty Tools': '#f59e0b',
      'Automotive': '#ef4444',
      'Construction': '#8b5cf6',
      'Painting': '#06b6d4',
      'Cleaning': '#84cc16'
    }[category] || '#6b7280';

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${iconColor}"/>
          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
          <circle cx="12.5" cy="12.5" r="3" fill="${iconColor}"/>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  // Create user location icon
  const userIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
        <circle cx="10" cy="10" r="3" fill="white"/>
      </svg>
    `)}`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  if (isLoadingLocation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-100 rounded-xl p-8 text-center h-96 flex items-center justify-center"
      >
        <div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Map Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Tools Near You</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {locationError ? (
              <span className="text-red-600">{locationError}</span>
            ) : (
              <>
                <Navigation className="h-4 w-4" />
                <span>{tools.length} tools found</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-96 relative">
        <MapContainer
          center={userLocation || defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController userLocation={userLocation} />

          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Navigation className="h-4 w-4 text-primary-600 mr-1" />
                    <span className="font-medium">Your Location</span>
                  </div>
                  <p className="text-sm text-gray-600">You are here</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Tool Markers */}
          {tools.map((tool) => (
            <Marker
              key={tool.id}
              position={tool.location.coordinates}
              icon={createToolIcon(tool.category)}
              eventHandlers={{
                click: () => onToolSelect?.(tool),
              }}
            >
              <Popup>
                <div className="w-64">
                  <div className="flex items-start space-x-3">
                    <img
                      src={tool.images[0]}
                      alt={tool.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {tool.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            <span>{tool.rating}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{tool.category}</span>
                        </div>
                        <div className="flex items-center text-primary-600 font-medium text-sm">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {tool.price.daily}/day
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{tool.location.city}, {tool.location.state}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onToolSelect?.(tool)}
                        className="w-full mt-3 bg-primary-600 text-white text-xs py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
          <h4 className="text-xs font-medium text-gray-900 mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-primary-600 mr-2"></div>
              <span className="text-gray-600">Your Location</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
              <span className="text-gray-600">Available Tools</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 space-y-2 z-10">
          <button
            onClick={() => {
              if (userLocation) {
                // This would trigger map re-centering via MapController
                setUserLocation([...userLocation]);
              }
            }}
            className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
            title="Center on your location"
          >
            <Navigation className="h-4 w-4 text-gray-600" />
          </button>
          
          <button
            className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
            title="Find nearby tools"
          >
            <Zap className="h-4 w-4 text-primary-600" />
          </button>
        </div>
      </div>

      {/* Map Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Click markers to view tool details</span>
          <span>{tools.length} tools in your area</span>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveMap;