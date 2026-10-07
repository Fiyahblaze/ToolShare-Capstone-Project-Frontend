import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import stripeService from '../services/stripeService';
import toast from 'react-hot-toast';

interface StripeCheckoutProps {
  plan: {
    id: string;
    name: string;
    price: { monthly: number; yearly: number };
  };
  billingCycle: 'monthly' | 'yearly';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  plan,
  billingCycle,
  onSuccess,
  onError
}) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user?.email) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setLoading(true);

    try {
      const { url } = await stripeService.createCheckoutSession({
        plan: plan.id,
        customerEmail: user.email,
        billingCycle
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
      
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
  const displayPrice = billingCycle === 'yearly' ? `$${price}/year` : `$${price}/month`;

  return (
    <motion.button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
    >
      {loading ? (
        <>
          <Loader className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Subscribe for {displayPrice}
        </>
      )}
    </motion.button>
  );
};

export default StripeCheckout;