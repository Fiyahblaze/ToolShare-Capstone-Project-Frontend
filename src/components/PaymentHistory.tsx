import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, Eye, Filter, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  last4?: string;
  created: string;
  description: string;
  toolTitle: string;
  type: 'rental' | 'deposit' | 'refund';
}

interface PaymentHistoryProps {
  payments?: Payment[];
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments = [] }) => {
  const [filter, setFilter] = useState<'all' | 'succeeded' | 'pending' | 'failed' | 'refunded'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Mock payment data if none provided
  const mockPayments: Payment[] = [
    {
      id: 'payment_1',
      amount: 125,
      currency: 'usd',
      status: 'succeeded',
      paymentMethod: 'card',
      last4: '4242',
      created: '2024-01-20T10:30:00Z',
      description: 'Rental payment for DeWalt Drill',
      toolTitle: 'DeWalt 20V Cordless Drill',
      type: 'rental'
    },
    {
      id: 'payment_2',
      amount: 100,
      currency: 'usd',
      status: 'refunded',
      paymentMethod: 'card',
      last4: '4242',
      created: '2024-01-22T15:45:00Z',
      description: 'Security deposit refund',
      toolTitle: 'DeWalt 20V Cordless Drill',
      type: 'refund'
    },
    {
      id: 'payment_3',
      amount: 65,
      currency: 'usd',
      status: 'succeeded',
      paymentMethod: 'paypal',
      created: '2024-01-18T09:15:00Z',
      description: 'Rental payment for Hair Dryer',
      toolTitle: 'Professional Hair Dryer',
      type: 'rental'
    }
  ];

  const allPayments = payments.length > 0 ? payments : mockPayments;

  const filteredPayments = allPayments
    .filter(payment => filter === 'all' || payment.status === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'refunded':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadReceipt = (paymentId: string) => {
    toast.success(`Downloading receipt for payment ${paymentId}`);
  };

  const handleViewDetails = (payment: Payment) => {
    toast.success(`Viewing details for ${payment.description}`);
  };

  const totalAmount = filteredPayments
    .filter(p => p.status === 'succeeded' && p.type !== 'refund')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunds = filteredPayments
    .filter(p => p.status === 'refunded' || p.type === 'refund')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          <p className="text-sm text-gray-600">Track all your rental payments and refunds</p>
        </div>
        <button
          onClick={() => toast.success('Exporting payment history...')}
          className="btn-outline flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">${totalAmount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Refunds</p>
              <p className="text-xl font-bold text-gray-900">${totalRefunds}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-xl font-bold text-gray-900">{filteredPayments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="all">All Payments</option>
              <option value="succeeded">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">No payments match your current filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPayments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{payment.description}</h4>
                        {getStatusIcon(payment.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{new Date(payment.created).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>
                          {payment.paymentMethod === 'card' 
                            ? `•••• ${payment.last4}` 
                            : payment.paymentMethod
                          }
                        </span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`font-semibold ${
                        payment.type === 'refund' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {payment.type === 'refund' ? '+' : ''}${payment.amount}
                      </p>
                      <p className="text-xs text-gray-500 uppercase">
                        {payment.currency}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadReceipt(payment.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Download receipt"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;