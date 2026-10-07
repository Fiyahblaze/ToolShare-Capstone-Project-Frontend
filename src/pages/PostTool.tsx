import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, DollarSign, Calendar, FileText, MapPin, Shield, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToolStore } from '../store/toolStore';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import IDVerification from '../components/IDVerification';
import toast from 'react-hot-toast';

interface ToolFormData {
  title: string;
  description: string;
  category: string;
  hourlyPrice?: number;
  dailyPrice: number;
  weeklyPrice?: number;
  deposit: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  rules: string;
}

const PostTool: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIDVerification, setShowIDVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  
  const { addTool } = useToolStore();
  const { user } = useAuthStore();
  const { createToolPostingConfirmation } = useMessageStore();
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ToolFormData>();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            You need to sign in to post tools on ToolShare. Join our community to start earning money by sharing your tools.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/auth')}
              className="btn-outline flex items-center"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="btn-primary"
            >
              Join ToolShare
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    'Power Tools',
    'Hand Tools',
    'Garden Tools',
    'Beauty Tools',
    'Automotive',
    'Construction',
    'Painting',
    'Cleaning',
    'Other'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate image upload - in real app, upload to cloud storage
      const newImages = Array.from(files).map((file, index) => 
        `https://images.pexels.com/photos/${1000000 + index}/pexels-photo-${1000000 + index}.jpeg?auto=compress&cs=tinysrgb&w=400`
      );
      setImages(prev => [...prev, ...newImages].slice(0, 5));
      toast.success(`${files.length} image(s) uploaded`);
    }
  };

  const handleVerificationComplete = (data: any) => {
    setVerificationData(data);
    setIsVerified(true);
    setShowIDVerification(false);
    toast.success('Identity verified! You can now post your tool.');
  };

  const onSubmit = async (data: ToolFormData) => {
    if (!isVerified) {
      toast.error('Please complete identity verification first');
      setShowIDVerification(true);
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      const newTool = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        category: data.category,
        images,
        price: {
          hourly: data.hourlyPrice,
          daily: data.dailyPrice,
          weekly: data.weeklyPrice,
        },
        deposit: data.deposit,
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          coordinates: [-122.4194, 37.7749] as [number, number], // Mock coordinates
        },
        owner: {
          id: user!.id,
          name: user!.name,
          avatar: user!.avatar,
          rating: user!.rating,
          responseRate: 95,
          verified: true, // Set to true since they completed verification
        },
        availability: {
          available: true,
          calendar: [],
        },
        rules: data.rules.split('\n').filter(rule => rule.trim()),
        rating: 5.0,
        reviewCount: 0,
        verificationData: verificationData, // Store verification data
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      // Add tool to store
      addTool(newTool);
      
      // Send confirmation message to user
      createToolPostingConfirmation(user!.id, newTool);
      
      // Show success message
      toast.success('🎉 Tool posted successfully! Your verified identity ensures trust in the community.');
      
      // Reset form
      setCurrentStep(1);
      setImages([]);
      setIsVerified(false);
      setVerificationData(null);
      reset();
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      toast.error('Failed to post tool. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Photos', icon: Camera },
    { number: 3, title: 'Pricing', icon: DollarSign },
    { number: 4, title: 'Location & Rules', icon: MapPin },
  ];

  const startPostingProcess = () => {
    if (!isVerified) {
      setShowIDVerification(true);
    } else {
      // Continue with normal flow
      toast.success('Identity verified! Continue posting your tool.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Your Tool</h1>
        <p className="text-gray-600">Share your tools with the community and earn money</p>
      </motion.div>

      {/* Verification Status */}
      {!isVerified && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-900">Identity Verification Required</p>
                <p className="text-sm text-blue-700">Verify your identity to build trust and ensure community safety</p>
              </div>
            </div>
            <button
              onClick={startPostingProcess}
              className="btn-primary text-sm"
            >
              Verify Identity
            </button>
          </div>
        </motion.div>
      )}

      {isVerified && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-900">Identity Verified ✓</p>
              <p className="text-sm text-green-700">Your verified status will be displayed to potential renters</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  Step {step.number}
                </p>
                <p className={`text-xs ${
                  currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tool Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="input-field"
                placeholder="e.g., DeWalt 20V Cordless Drill"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="input-field"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="input-field"
                placeholder="Describe your tool, its condition, what's included, and any special features..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Photos */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tool Photos * (At least 1 required, max 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Upload clear photos of your tool from different angles
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="btn-primary cursor-pointer inline-block"
                >
                  Choose Photos
                </label>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Tool ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Pricing */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    {...register('hourlyPrice')}
                    className="input-field pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Rate *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    {...register('dailyPrice', { required: 'Daily price is required' })}
                    className="input-field pl-10"
                    placeholder="0.00"
                  />
                </div>
                {errors.dailyPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.dailyPrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Rate (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    {...register('weeklyPrice')}
                    className="input-field pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Deposit *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  {...register('deposit', { required: 'Deposit is required' })}
                  className="input-field pl-10"
                  placeholder="0.00"
                />
              </div>
              {errors.deposit && (
                <p className="text-red-500 text-sm mt-1">{errors.deposit.message}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Refundable deposit to cover potential damages
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 4: Location & Rules */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                {...register('address', { required: 'Address is required' })}
                className="input-field"
                placeholder="Street address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="input-field"
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  {...register('state', { required: 'State is required' })}
                  className="input-field"
                  placeholder="State"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  {...register('zipCode', { required: 'ZIP code is required' })}
                  className="input-field"
                  placeholder="ZIP"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Rules & Guidelines
              </label>
              <textarea
                {...register('rules')}
                rows={4}
                className="input-field"
                placeholder="Enter each rule on a new line, e.g.:&#10;Return clean and in same condition&#10;No lending to others&#10;Report any damage immediately"
              />
              <p className="text-sm text-gray-600 mt-1">
                Set clear expectations for renters (one rule per line)
              </p>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isVerified}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isVerified ? 'Verify Identity First' : 'Next'}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !isVerified}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </div>
              ) : (
                'Post Tool'
              )}
            </button>
          )}
        </div>
      </form>

      {/* ID Verification Modal */}
      <IDVerification
        isOpen={showIDVerification}
        onClose={() => setShowIDVerification(false)}
        onVerificationComplete={handleVerificationComplete}
        purpose="posting"
      />
    </div>
  );
};

export default PostTool;