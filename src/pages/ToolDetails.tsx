import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Shield, 
  MessageCircle,
  Heart,
  Share2,
  Clock,
  CheckCircle,
  AlertTriangle,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useToolStore } from '../store/toolStore';
import { useAuthStore } from '../store/authStore';
import { useRentalStore } from '../store/rentalStore';
import IDVerification from '../components/IDVerification';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';

const ToolDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tools } = useToolStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addRental } = useRentalStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [rentalDuration, setRentalDuration] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showIDVerification, setShowIDVerification] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  const tool = tools.find(t => t.id === id);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tool not found</h2>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (rentalDuration) {
      case 'hourly':
        return (tool.price.hourly || 0) * diffDays * 8; // Assume 8 hours per day
      case 'daily':
        return tool.price.daily * diffDays;
      case 'weekly':
        return (tool.price.weekly || 0) * Math.ceil(diffDays / 7);
      default:
        return 0;
    }
  };

  const handleVerificationComplete = (data: any) => {
    setVerificationData(data);
    setIsVerified(true);
    setShowIDVerification(false);
    toast.success('Identity verified! You can now proceed with booking.');
    setShowBookingModal(true);
  };

  const handleBookingConfirm = () => {
    if (!isVerified) {
      toast.error('Please complete identity verification first');
      setShowIDVerification(true);
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select rental dates');
      return;
    }

    // Store booking data and show payment modal
    const booking = {
      toolId: tool.id,
      toolTitle: tool.title,
      toolImage: tool.images[0],
      startDate,
      endDate,
      rentalDuration,
      totalCost: calculateTotal(),
      deposit: tool.deposit,
      verificationData
    };

    setBookingData(booking);
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!bookingData) return;

    setIsBooking(true);

    try {
      const newRental = {
        id: Date.now().toString(),
        toolId: tool.id,
        toolTitle: tool.title,
        toolImage: tool.images[0],
        renterId: user!.id,
        renterName: user!.name,
        ownerId: tool.owner.id,
        ownerName: tool.owner.name,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalCost: bookingData.totalCost,
        deposit: bookingData.deposit,
        status: 'pending' as const,
        contract: {
          id: `contract-${Date.now()}`,
          terms: `Rental agreement for ${tool.title}. Renter agrees to return the tool in the same condition as received. Any damages will be deducted from the security deposit. Both parties have completed identity verification for security.`,
          signedByOwner: false,
          signedByRenter: false,
          createdAt: new Date().toISOString().split('T')[0]
        },
        verificationData: bookingData.verificationData,
        paymentData: paymentData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      addRental(newRental);
      toast.success('🎉 Booking confirmed! Payment processed successfully.');
      setShowPaymentModal(false);
      navigate('/rentals');
      
    } catch (error) {
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const startBookingProcess = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to rent tools');
      navigate('/auth');
      return;
    }

    if (!isVerified) {
      setShowIDVerification(true);
    } else {
      setShowBookingModal(true);
    }
  };

  const handleMessageOwner = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to message tool owners');
      navigate('/auth');
      return;
    }
    toast.success('Opening message conversation...');
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save favorites');
      navigate('/auth');
      return;
    }
    toast.success(`Added ${tool.title} to favorites!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Search
      </motion.button>

      {/* Guest Notice */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <LogIn className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-900">Sign in to rent this tool</p>
                <p className="text-sm text-blue-700">Join ToolShare to access secure rentals, messaging, and more</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/auth')}
                className="btn-outline text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary text-sm"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Join Now
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={tool.images[selectedImage]}
              alt={tool.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {tool.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {tool.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${tool.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{tool.title}</h1>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleFavorite}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{tool.rating}</span>
                <span className="ml-1 text-gray-600">({tool.reviewCount} reviews)</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-primary-600 font-medium">{tool.category}</span>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{tool.location.city}, {tool.location.state}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Pricing</h3>
            <div className="space-y-2">
              {tool.price.hourly && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hourly</span>
                  <span className="font-medium">${tool.price.hourly}/hour</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Daily</span>
                <span className="font-medium">${tool.price.daily}/day</span>
              </div>
              {tool.price.weekly && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Weekly</span>
                  <span className="font-medium">${tool.price.weekly}/week</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Security Deposit</span>
                <span className="font-medium">${tool.deposit}</span>
              </div>
            </div>
          </div>

          {/* Owner */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Tool Owner</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={tool.owner.avatar}
                  alt={tool.owner.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {tool.owner.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <Shield className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">{tool.owner.name}</p>
                  {tool.owner.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ID Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span>{tool.owner.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{tool.owner.responseRate}% response rate</span>
                </div>
              </div>
              <button 
                onClick={handleMessageOwner}
                className="btn-outline flex items-center"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </button>
            </div>
          </div>

          {/* Verification Status - Only show for authenticated users */}
          {isAuthenticated && (
            <div className={`p-4 rounded-lg border ${
              isVerified 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center">
                <Shield className={`h-5 w-5 mr-2 ${
                  isVerified ? 'text-green-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <p className={`font-medium ${
                    isVerified ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    {isVerified ? 'Identity Verified ✓' : 'Secure Rental Process'}
                  </p>
                  <p className={`text-sm ${
                    isVerified ? 'text-green-700' : 'text-blue-700'
                  }`}>
                    {isVerified 
                      ? 'Your identity has been verified for secure transactions.'
                      : 'ID verification required for all rentals to ensure community safety.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center space-x-2">
            {tool.availability.available ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Available for rent</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-red-600 font-medium">Currently unavailable</span>
              </>
            )}
          </div>

          {/* Book Button */}
          <button
            onClick={startBookingProcess}
            disabled={!tool.availability.available}
            className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isAuthenticated 
              ? 'Sign In to Rent This Tool'
              : tool.availability.available 
              ? 'Book This Tool' 
              : 'Not Available'
            }
          </button>
        </motion.div>
      </div>

      {/* Description & Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
          <p className="text-gray-700 leading-relaxed">{tool.description}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Rental Rules</h3>
          <ul className="space-y-2">
            {tool.rules.map((rule, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Booking Modal - Only for authenticated users */}
      {isAuthenticated && showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Book {tool.title}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rental Duration
                </label>
                <select
                  value={rentalDuration}
                  onChange={(e) => setRentalDuration(e.target.value as any)}
                  className="input-field"
                >
                  {tool.price.hourly && <option value="hourly">Hourly</option>}
                  <option value="daily">Daily</option>
                  {tool.price.weekly && <option value="weekly">Weekly</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Rental Cost</span>
                    <span className="font-medium">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="font-medium">${tool.deposit}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">${calculateTotal() + tool.deposit}</span>
                  </div>
                </div>
              )}

              {isVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800 font-medium">Identity Verified</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Your identity verification ensures a secure transaction for both parties.
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingConfirm}
                disabled={!startDate || !endDate || !isVerified}
                className="flex-1 btn-primary"
              >
                Continue to Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ID Verification Modal - Only for authenticated users */}
      {isAuthenticated && (
        <IDVerification
          isOpen={showIDVerification}
          onClose={() => setShowIDVerification(false)}
          onVerificationComplete={handleVerificationComplete}
          purpose="renting"
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && bookingData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={bookingData.totalCost}
          deposit={bookingData.deposit}
          toolTitle={bookingData.toolTitle}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default ToolDetails;