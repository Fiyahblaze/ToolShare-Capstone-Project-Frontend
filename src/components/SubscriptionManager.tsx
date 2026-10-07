import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Star,
  Zap,
  Building,
  Users,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PaymentModal from './PaymentModal';
import toast from 'react-hot-toast';

interface SubscriptionManagerProps {
  currentPlan?: {
    id: string;
    name: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    status: 'active' | 'canceled' | 'past_due';
    nextBilling: string;
    features: string[];
  };
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ currentPlan }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock current plan if none provided
  const mockCurrentPlan = {
    id: 'pro',
    name: 'Pro User',
    price: 4.99,
    billingCycle: 'monthly' as const,
    status: 'active' as const,
    nextBilling: '2024-02-20',
    features: [
      'Unlimited tool listings',
      '3 featured tools per month',
      'Rental analytics',
      'Priority support'
    ]
  };

  const plan = currentPlan || mockCurrentPlan;

  const availableUpgrades = [
    {
      id: 'commercial',
      name: 'Commercial',
      description: 'Perfect for small businesses',
      price: { monthly: 29.99, yearly: 299.99 },
      icon: Building,
      color: 'purple',
      features: [
        'All Pro features',
        'Team management (5 users)',
        'Bulk tool upload',
        '5 featured listings/month',
        'Custom branding'
      ],
      popular: false
    },
    {
      id: 'pro-commercial',
      name: 'Pro Commercial',
      description: 'For large businesses',
      price: { monthly: 59.99, yearly: 599.99 },
      icon: Crown,
      color: 'gold',
      features: [
        'All Commercial features',
        'Unlimited team members',
        'Premium placement',
        'White-label branding',
        '24/7 phone support'
      ],
      popular: true
    }
  ];

  const handleUpgrade = (upgradePlan: any) => {
    setSelectedPlan(upgradePlan);
    setShowUpgradeModal(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    toast.success(`🎉 Successfully upgraded to ${selectedPlan.name}!`);
    setShowUpgradeModal(false);
    // In real app, update user's subscription
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = () => {
    toast.success('Subscription canceled. You\'ll have access until the end of your billing period.');
    setShowCancelModal(false);
    // In real app, cancel the subscription
  };

  const handleManageBilling = () => {
    toast.success('Redirecting to billing portal...');
    // In real app, redirect to Stripe customer portal
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'canceled':
        return <X className="h-4 w-4 text-red-600" />;
      case 'past_due':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <Crown className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Current Plan</h3>
              <p className="text-gray-600">Manage your subscription and billing</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(plan.status)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">{plan.name}</h4>
            <p className="text-2xl font-bold text-primary-600">
              ${plan.price}/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {plan.billingCycle === 'monthly' ? 'Billed monthly' : 'Billed annually'}
            </p>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Next Billing</h4>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700">
                {new Date(plan.nextBilling).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Auto-renewal enabled
            </p>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Plan Features</h4>
            <div className="space-y-1">
              {plan.features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  {feature}
                </div>
              ))}
              {plan.features.length > 2 && (
                <p className="text-xs text-gray-500">+{plan.features.length - 2} more features</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleManageBilling}
            className="btn-primary flex items-center"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Billing
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="btn-outline flex items-center"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View All Plans
          </button>
          <button
            onClick={handleCancelSubscription}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Usage</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-600">Tools Listed</p>
            <p className="text-xs text-green-600 mt-1">Unlimited available</p>
          </div>

          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2/3</p>
            <p className="text-sm text-gray-600">Featured Tools</p>
            <p className="text-xs text-blue-600 mt-1">1 remaining this month</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">$247</p>
            <p className="text-sm text-gray-600">Monthly Earnings</p>
            <p className="text-xs text-green-600 mt-1">+18% from last month</p>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {plan.id !== 'pro-commercial' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upgrade Your Plan</h3>
              <p className="text-gray-600">Unlock more features and grow your business</p>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              View All Plans
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableUpgrades.map((upgradePlan) => (
              <motion.div
                key={upgradePlan.id}
                className={`relative border-2 rounded-xl p-6 transition-all hover:shadow-md ${
                  upgradePlan.popular 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
              >
                {upgradePlan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-lg mr-3 ${
                    upgradePlan.color === 'purple' ? 'bg-purple-100' : 'bg-yellow-100'
                  }`}>
                    <upgradePlan.icon className={`h-6 w-6 ${
                      upgradePlan.color === 'purple' ? 'text-purple-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{upgradePlan.name}</h4>
                    <p className="text-sm text-gray-600">{upgradePlan.description}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900">
                    ${upgradePlan.price.monthly}/mo
                  </p>
                  <p className="text-sm text-gray-600">
                    or ${upgradePlan.price.yearly}/year (save 17%)
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {upgradePlan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                  {upgradePlan.features.length > 3 && (
                    <p className="text-xs text-gray-500">+{upgradePlan.features.length - 3} more features</p>
                  )}
                </div>

                <button
                  onClick={() => handleUpgrade(upgradePlan)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    upgradePlan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Upgrade to {upgradePlan.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Billing History Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Billing</h3>
          <button
            onClick={() => navigate('/profile')} // Navigate to payments tab
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Pro User Subscription</p>
                <p className="text-sm text-gray-600">Jan 20, 2024</p>
              </div>
            </div>
            <span className="font-medium text-gray-900">$4.99</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <RefreshCw className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Security Deposit Refund</p>
                <p className="text-sm text-gray-600">Jan 18, 2024</p>
              </div>
            </div>
            <span className="font-medium text-green-600">+$100.00</span>
          </div>
        </div>
      </div>

      {/* Upgrade Payment Modal */}
      {showUpgradeModal && selectedPlan && (
        <PaymentModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          amount={selectedPlan.price.monthly}
          deposit={0}
          toolTitle={`${selectedPlan.name} Subscription Upgrade`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cancel Subscription?</h3>
              <p className="text-gray-600 mb-6">
                You'll lose access to premium features at the end of your billing period on {new Date(plan.nextBilling).toLocaleDateString()}.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 btn-outline"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={confirmCancelSubscription}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;