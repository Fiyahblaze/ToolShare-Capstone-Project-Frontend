import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  deposit: number;
  toolTitle: string;
  onPaymentSuccess: (paymentData: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  deposit,
  toolTitle,
  onPaymentSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    zip: ''
  });

  if (!isOpen) return null;

  const total = amount + deposit;

  const handlePayment = async () => {
    if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name) {
      toast.error('Please fill in all card details');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const paymentData = {
        id: `payment_${Date.now()}`,
        amount: total,
        currency: 'usd',
        status: 'succeeded',
        paymentMethod: paymentMethod,
        last4: cardData.number.slice(-4),
        created: new Date().toISOString(),
        description: `Rental payment for ${toolTitle}`
      };

      onPaymentSuccess(paymentData);
      toast.success('Payment successful! Your rental is confirmed.');
      onClose();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-600">Complete your rental booking</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Rental Cost</span>
              <span className="font-medium">${amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Security Deposit</span>
              <span className="font-medium">${deposit}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-semibold text-gray-900">${total}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Security deposit will be refunded after tool return
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border-2 rounded-lg flex items-center justify-center transition-colors ${
                paymentMethod === 'card'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              <span className="font-medium">Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`p-3 border-2 rounded-lg flex items-center justify-center transition-colors ${
                paymentMethod === 'paypal'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-bold text-blue-600">PayPal</span>
            </button>
          </div>
        </div>

        {/* Card Details */}
        {paymentMethod === 'card' && (
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    number: formatCardNumber(e.target.value) 
                  }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      expiry: formatExpiry(e.target.value) 
                    }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardData.cvc}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      cvc: e.target.value.replace(/\D/g, '').slice(0, 4) 
                    }))}
                    placeholder="123"
                    maxLength={4}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardData.name}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    name: e.target.value 
                  }))}
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={cardData.zip}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    zip: e.target.value.replace(/\D/g, '').slice(0, 5) 
                  }))}
                  placeholder="12345"
                  maxLength={5}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* PayPal */}
        {paymentMethod === 'paypal' && (
          <div className="p-6">
            <div className="text-center py-8">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">PP</span>
              </div>
              <p className="text-gray-600 mb-4">
                You'll be redirected to PayPal to complete your payment
              </p>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-6 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-blue-600 mr-2" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Secure Payment</p>
              <p className="text-blue-700">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 btn-primary"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay $${total}`
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;