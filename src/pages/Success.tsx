import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, Star } from 'lucide-react';
import stripeService from '../services/stripeService';
import toast from 'react-hot-toast';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const data = await stripeService.verifySession(sessionId!);
      setSessionData(data);
      toast.success('Payment successful! Welcome to your new plan.');
    } catch (error) {
      toast.error('Failed to verify payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Welcome to your new ToolShare plan. You now have access to all premium features.
        </p>

        {/* Session Details */}
        {sessionData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Plan: {sessionData.plan}</p>
              <p>Amount: ${sessionData.amount}</p>
              <p>Session ID: {sessionData.sessionId}</p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center text-left">
            <Star className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-700">Access premium features in your dashboard</span>
          </div>
          <div className="flex items-center text-left">
            <Download className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-700">Download your receipt from your profile</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full btn-primary flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="w-full btn-outline"
          >
            View Payment History
          </button>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact our support team at support@toolshare.com
        </p>
      </motion.div>
    </div>
  );
};

export default Success;