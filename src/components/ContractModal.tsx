import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Pen, Check, AlertCircle } from 'lucide-react';
import { Rental } from '../store/rentalStore';
import toast from 'react-hot-toast';

interface ContractModalProps {
  rental: Rental;
  isOpen: boolean;
  onClose: () => void;
  onSign: (rentalId: string, userType: 'owner' | 'renter') => void;
  userType: 'owner' | 'renter';
}

const ContractModal: React.FC<ContractModalProps> = ({
  rental,
  isOpen,
  onClose,
  onSign,
  userType
}) => {
  const [signature, setSignature] = useState('');
  const [_isDrawing, _setIsDrawing] = useState(false);

  if (!isOpen) return null;

  // Early return if contract is not available
  if (!rental.contract) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl max-w-md w-full p-6"
        >
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contract Not Available</h3>
            <p className="text-gray-600 mb-4">The contract for this rental is not available.</p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSign = () => {
    if (!signature.trim()) {
      toast.error('Please provide your signature');
      return;
    }
    onSign(rental.id, userType);
    toast.success('Contract signed successfully!');
    onClose();
  };

  const isAlreadySigned = userType === 'owner' 
    ? rental.contract.signedByOwner 
    : rental.contract.signedByRenter;

  const otherPartySigned = userType === 'owner' 
    ? rental.contract.signedByRenter 
    : rental.contract.signedByOwner;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Rental Contract</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contract Header */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Rental Agreement</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tool:</span>
                <span className="ml-2 font-medium">{rental.toolTitle}</span>
              </div>
              <div>
                <span className="text-gray-600">Contract ID:</span>
                <span className="ml-2 font-medium">{rental.contract.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Owner:</span>
                <span className="ml-2 font-medium">{rental.ownerName}</span>
              </div>
              <div>
                <span className="text-gray-600">Renter:</span>
                <span className="ml-2 font-medium">{rental.renterName}</span>
              </div>
              <div>
                <span className="text-gray-600">Start Date:</span>
                <span className="ml-2 font-medium">{rental.startDate}</span>
              </div>
              <div>
                <span className="text-gray-600">End Date:</span>
                <span className="ml-2 font-medium">{rental.endDate}</span>
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Terms and Conditions</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
              <p className="mb-4">{rental.contract.terms}</p>
              
              <div className="space-y-3">
                <div>
                  <strong>1. Rental Period:</strong> The rental period begins on {rental.startDate} and ends on {rental.endDate}. Late returns may incur additional charges.
                </div>
                
                <div>
                  <strong>2. Security Deposit:</strong> A security deposit of ${rental.deposit} is required and will be refunded upon satisfactory return of the tool.
                </div>
                
                <div>
                  <strong>3. Condition:</strong> The renter agrees to return the tool in the same condition as received, normal wear and tear excepted.
                </div>
                
                <div>
                  <strong>4. Liability:</strong> The renter assumes full responsibility for the tool during the rental period and agrees to cover any damages or losses.
                </div>
                
                <div>
                  <strong>5. Usage:</strong> The tool must be used only for its intended purpose and in accordance with manufacturer guidelines.
                </div>
              </div>
            </div>
          </div>

          {/* Signature Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${rental.contract.signedByOwner ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center">
                {rental.contract.signedByOwner ? (
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <span className="font-medium text-gray-900">Owner Signature</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {rental.contract.signedByOwner ? 'Signed' : 'Pending signature'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${rental.contract.signedByRenter ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center">
                {rental.contract.signedByRenter ? (
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <span className="font-medium text-gray-900">Renter Signature</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {rental.contract.signedByRenter ? 'Signed' : 'Pending signature'}
              </p>
            </div>
          </div>

          {/* Signature Section */}
          {!isAlreadySigned && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Your Signature</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type your full name to sign
                  </label>
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Enter your full name"
                    className="input-field"
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Electronic Signature Agreement</p>
                      <p>By typing your name above, you agree that this electronic signature has the same legal effect as a handwritten signature.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button onClick={onClose} className="flex-1 btn-outline">
              {isAlreadySigned ? 'Close' : 'Cancel'}
            </button>
            
            {!isAlreadySigned && (
              <button
                onClick={handleSign}
                disabled={!signature.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Pen className="h-4 w-4 mr-2" />
                Sign Contract
              </button>
            )}
          </div>

          {isAlreadySigned && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">You have already signed this contract</span>
              </div>
              {!otherPartySigned && (
                <p className="text-sm text-green-700 mt-1">
                  Waiting for the other party to sign before the rental can begin.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContractModal;