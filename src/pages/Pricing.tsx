import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  BarChart3, 
  Upload, 
  Crown,
  Shield,
  Headphones,
  TrendingUp,
  Building,
  Sparkles,
  Users,
  Globe,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for casual tool sharing',
      price: { monthly: 0, yearly: 0 },
      popular: false,
      features: [
        { text: 'List up to 2 tools', included: true },
        { text: 'Rent unlimited tools', included: true },
        { text: 'Basic messaging', included: true },
        { text: 'Community support', included: true },
        { text: 'Featured listings', included: false },
        { text: 'Rental insights & analytics', included: false },
        { text: 'Priority support', included: false },
        { text: 'Advanced features', included: false }
      ],
      buttonText: 'Continue Free',
      buttonVariant: 'outline' as const,
      icon: Zap,
      color: 'gray'
    },
    {
      id: 'pro',
      name: 'Pro User',
      description: 'For active tool sharers and renters',
      price: { monthly: 4.99, yearly: 49.99 },
      popular: true,
      features: [
        { text: 'Unlimited tool listings', included: true },
        { text: 'Rent unlimited tools', included: true },
        { text: '3 featured tools each month', included: true },
        { text: 'Rental stats & insights', included: true },
        { text: 'Priority chat support', included: true },
        { text: 'Smart pricing suggestions', included: true },
        { text: 'Advanced search filters', included: true },
        { text: 'Mobile app access', included: true }
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'primary' as const,
      icon: Star,
      color: 'blue',
      savings: 'Save $10/year'
    },
    {
      id: 'commercial',
      name: 'Commercial',
      description: 'For small businesses and contractors',
      price: { monthly: 29.99, yearly: 299.99 },
      popular: false,
      features: [
        { text: 'Unlimited tool listings', included: true },
        { text: 'Company dashboard & analytics', included: true },
        { text: 'Bulk tool upload', included: true },
        { text: '5 featured listings per month', included: true },
        { text: 'Team management (up to 5 users)', included: true },
        { text: 'Custom branding options', included: true },
        { text: 'API access', included: true },
        { text: 'Dedicated account manager', included: true }
      ],
      buttonText: 'Subscribe Now',
      buttonVariant: 'primary' as const,
      icon: Building,
      color: 'purple',
      savings: 'Save $60/year'
    },
    {
      id: 'pro-commercial',
      name: 'Pro Commercial',
      description: 'For large businesses and enterprises',
      price: { monthly: 59.99, yearly: 599.99 },
      popular: false,
      features: [
        { text: 'All Commercial features', included: true },
        { text: 'Premium search placement', included: true },
        { text: 'Advanced rental analytics', included: true },
        { text: 'White-label company profile', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Custom integrations', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'SLA guarantee', included: true }
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'primary' as const,
      icon: Crown,
      color: 'gold',
      savings: 'Save $120/year'
    }
  ];

  const handlePlanSelect = (plan: any) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe to a plan');
      navigate('/auth');
      return;
    }

    if (plan.id === 'starter') {
      toast.success('You\'re already on the free Starter plan!');
      return;
    }

    if (plan.id === 'pro-commercial') {
      toast.success('Redirecting to sales team...');
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    toast.success(`🎉 Welcome to ${selectedPlan.name}! Your subscription is now active.`);
    setShowPaymentModal(false);
    navigate('/dashboard');
  };

  const getPrice = (plan: any) => {
    return billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
  };

  const getPriceDisplay = (plan: any) => {
    const price = getPrice(plan);
    if (price === 0) return 'Free';
    
    if (billingCycle === 'yearly') {
      return `$${price}/year`;
    }
    return `$${price}/month`;
  };

  const getMonthlyEquivalent = (plan: any) => {
    if (billingCycle === 'yearly' && plan.price.yearly > 0) {
      const monthlyEquivalent = (plan.price.yearly / 12).toFixed(2);
      return `$${monthlyEquivalent}/month`;
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Tool Share Plans
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Unlock the full power of your tools. Flexible pricing for DIYers and businesses.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-lg ${
              plan.popular 
                ? 'border-primary-500 ring-2 ring-primary-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="p-8">
              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                  plan.color === 'gray' ? 'bg-gray-100' :
                  plan.color === 'blue' ? 'bg-blue-100' :
                  plan.color === 'purple' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  <plan.icon className={`h-6 w-6 ${
                    plan.color === 'gray' ? 'text-gray-600' :
                    plan.color === 'blue' ? 'text-blue-600' :
                    plan.color === 'purple' ? 'text-purple-600' :
                    'text-yellow-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {getPriceDisplay(plan)}
                  </span>
                  {getMonthlyEquivalent(plan) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {getMonthlyEquivalent(plan)} billed annually
                    </p>
                  )}
                  {billingCycle === 'yearly' && plan.savings && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {plan.savings}
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-gray-300 mr-3 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      feature.included ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.buttonVariant === 'primary'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Compare All Features
        </h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Starter</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Pro User</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Commercial</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Pro Commercial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Tool Listings</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 2</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Featured Listings</td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">3/month</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">5/month</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Analytics & Insights</td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Team Management</td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 5 users</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Priority Support</td>
                  <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">24/7 Phone</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need help choosing a plan?
              </h3>
              <p className="text-gray-600">
                Our team is here to help! Contact us and we'll help you find the perfect plan for your needs.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to get started?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of users who are already earning money by sharing their tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handlePlanSelect(plans[1])} // Pro plan
            className="btn-primary px-8 py-3 text-lg"
          >
            Start Free Trial
          </button>
          <button
            onClick={() => navigate('/search')}
            className="btn-outline px-8 py-3 text-lg"
          >
            Browse Tools
          </button>
        </div>
      </motion.div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={getPrice(selectedPlan)}
          deposit={0}
          toolTitle={`${selectedPlan.name} Subscription`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Pricing;