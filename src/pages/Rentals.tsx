import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, DollarSign, FileText, Star, MessageCircle } from 'lucide-react';
import { useRentalStore } from '../store/rentalStore';
import { useAuthStore } from '../store/authStore';
import { format, differenceInDays } from 'date-fns';
import ContractModal from '../components/ContractModal';

const Rentals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'renting' | 'lending'>('renting');
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const { rentals, getUserRentals, getOwnerRentals, signContract } = useRentalStore();
  const { user } = useAuthStore();

  const userRentals = getUserRentals(user!.id);
  const ownerRentals = getOwnerRentals(user!.id);

  const tabs = [
    { id: 'renting', label: 'My Rentals', count: userRentals.length },
    { id: 'lending', label: 'My Listings', count: ownerRentals.length },
  ];

  const currentRentals = activeTab === 'renting' ? userRentals : ownerRentals;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRemainingTime = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const days = differenceInDays(end, now);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    } else if (days === 0) {
      return 'Due today';
    } else {
      return 'Overdue';
    }
  };

  const handleContractSign = (rentalId: string, userType: 'owner' | 'renter') => {
    signContract(rentalId, userType);
    setSelectedContract(null);
  };

  const selectedRental = currentRentals.find(r => r.id === selectedContract);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Rentals</h1>
        <p className="text-gray-600">Manage your rental agreements and tool listings</p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'renting' | 'lending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Rentals List */}
      <div className="space-y-6">
        {currentRentals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">
              {activeTab === 'renting' ? '🔧' : '📋'}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'renting' ? 'No active rentals' : 'No tool listings'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'renting'
                ? 'Start renting tools from the community'
                : 'Share your tools and start earning money'
              }
            </p>
            <button className="btn-primary">
              {activeTab === 'renting' ? 'Browse Tools' : 'Post a Tool'}
            </button>
          </motion.div>
        ) : (
          currentRentals.map((rental, index) => (
            <motion.div
              key={rental.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start space-x-4">
                {/* Tool Image */}
                <img
                  src={rental.toolImage}
                  alt={rental.toolTitle}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />

                {/* Rental Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {rental.toolTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activeTab === 'renting' 
                          ? `Rented from ${rental.ownerName}`
                          : `Rented by ${rental.renterName}`
                        }
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                      {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                    </span>
                  </div>

                  {/* Rental Period */}
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(rental.startDate), 'MMM d')} - {format(new Date(rental.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {rental.status === 'active' && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="font-medium">
                          {getRemainingTime(rental.endDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cost */}
                  <div className="flex items-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>Total: ${rental.totalCost}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span>Deposit: ${rental.deposit}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    {rental.contract && (
                      <button 
                        onClick={() => setSelectedContract(rental.id)}
                        className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Contract
                      </button>
                    )}
                    
                    <button className="flex items-center text-secondary-600 hover:text-secondary-700 text-sm font-medium">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message {activeTab === 'renting' ? 'Owner' : 'Renter'}
                    </button>

                    {rental.status === 'completed' && (
                      <button className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                        <Star className="h-4 w-4 mr-1" />
                        Leave Review
                      </button>
                    )}

                    {rental.status === 'active' && activeTab === 'renting' && (
                      <button className="btn-primary text-sm px-4 py-1">
                        Request Extension
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Contract Status */}
              {rental.contract && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Contract Status:</span>
                    <div className="flex items-center space-x-4">
                      <span className={`flex items-center ${
                        rental.contract.signedByOwner ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        Owner: {rental.contract.signedByOwner ? '✓ Signed' : '⏳ Pending'}
                      </span>
                      <span className={`flex items-center ${
                        rental.contract.signedByRenter ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        Renter: {rental.contract.signedByRenter ? '✓ Signed' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {currentRentals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentRentals.filter(r => r.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active Rentals</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${currentRentals.reduce((sum, r) => sum + r.totalCost, 0)}
                </p>
                <p className="text-sm text-gray-600">
                  {activeTab === 'renting' ? 'Total Spent' : 'Total Earned'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.rating}
                </p>
                <p className="text-sm text-gray-600">Your Rating</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contract Modal */}
      {selectedContract && selectedRental && (
        <ContractModal
          rental={selectedRental}
          isOpen={true}
          onClose={() => setSelectedContract(null)}
          onSign={handleContractSign}
          userType={activeTab === 'renting' ? 'renter' : 'owner'}
        />
      )}
    </div>
  );
};

export default Rentals;