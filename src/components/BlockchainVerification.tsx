import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Camera, CheckCircle, Clock, QrCode, Upload, Download, Share2, Eye } from 'lucide-react';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';

interface BlockchainVerificationProps {
  toolId: string;
  onVerificationComplete: (verificationData: any) => void;
}

const BlockchainVerification: React.FC<BlockchainVerificationProps> = ({ 
  toolId, 
  onVerificationComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [_isProcessing, setIsProcessing] = useState(false);
  const [verificationHash, setVerificationHash] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState([
    {
      id: '1',
      date: '2024-01-15',
      hash: '0x1a2b3c4d5e6f7890abcdef1234567890',
      status: 'verified',
      photos: 3
    },
    {
      id: '2', 
      date: '2024-01-10',
      hash: '0x9876543210fedcba0987654321abcdef',
      status: 'verified',
      photos: 2
    }
  ]);

  const steps = [
    { id: 1, title: 'Photo Documentation', icon: Camera },
    { id: 2, title: 'Blockchain Recording', icon: Shield },
    { id: 3, title: 'Verification Complete', icon: CheckCircle },
  ];

  const handlePhotoCapture = () => {
    // Simulate photo capture
    const newPhoto = `photo-${Date.now()}`;
    setPhotos(prev => [...prev, newPhoto]);
    toast.success('Photo captured successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((_file, index) => 
        `uploaded-photo-${Date.now()}-${index}`
      );
      setPhotos(prev => [...prev, ...newPhotos]);
      toast.success(`${files.length} photo(s) uploaded successfully!`);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    toast.success('Photo removed');
  };

  const processVerification = async () => {
    if (photos.length < 2) {
      toast.error('Please capture at least 2 photos for verification');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(2);

    // Simulate blockchain processing with realistic steps
    const steps = [
      'Analyzing photo metadata...',
      'Generating cryptographic hash...',
      'Recording to blockchain...',
      'Confirming transaction...',
      'Creating verification certificate...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success(steps[i]);
    }

    // Generate mock blockchain hash
    const hash = `0x${Math.random().toString(16).substr(2, 40)}`;
    setVerificationHash(hash);
    setCurrentStep(3);
    setIsProcessing(false);

    const verificationData = {
      toolId,
      timestamp: new Date().toISOString(),
      photos,
      blockchainHash: hash,
      verified: true,
      gasUsed: '0.0023 ETH',
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000
    };

    // Add to history
    setVerificationHistory(prev => [{
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      hash,
      status: 'verified',
      photos: photos.length
    }, ...prev]);

    onVerificationComplete(verificationData);
    toast.success('🎉 Blockchain verification complete!');
  };

  const shareVerification = () => {
    if (verificationHash) {
      navigator.clipboard.writeText(verificationHash);
      toast.success('Verification hash copied to clipboard!');
    }
  };

  const downloadCertificate = () => {
    toast.success('Verification certificate downloaded!');
  };

  const viewOnBlockchain = () => {
    if (verificationHash) {
      toast.success('Opening blockchain explorer...');
      // In a real app, this would open etherscan or similar
    }
  };

  const startNewVerification = () => {
    setCurrentStep(1);
    setPhotos([]);
    setVerificationHash(null);
    setIsProcessing(false);
    toast.success('Starting new verification process');
  };

  return (
    <div className="space-y-6">
      {/* Main Verification Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Verification</h3>
              <p className="text-gray-600">Create an immutable record of your tool's condition</p>
            </div>
            {verificationHash && (
              <button
                onClick={() => setShowQRModal(true)}
                className="btn-outline flex items-center"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </button>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                currentStep >= step.id
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  Step {step.id}
                </p>
                <p className={`text-xs ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all ${
                  currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Document Tool Condition</h4>
              <p className="text-gray-600 mb-4">
                Take photos from multiple angles to create a permanent record
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handlePhotoCapture}
                  className="btn-primary flex items-center"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </button>
                <label className="btn-outline flex items-center cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {photos.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Captured Photos ({photos.length})</h4>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {photos.map((_photo, index) => (
                    <div key={index} className="relative aspect-square bg-gray-200 rounded-lg flex items-center justify-center group">
                      <Camera className="h-8 w-8 text-gray-400" />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={processVerification}
                  disabled={photos.length < 2}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Blockchain Record ({photos.length} photos)
                </button>
                {photos.length < 2 && (
                  <p className="text-sm text-amber-600 mt-2 text-center">
                    Minimum 2 photos required for verification
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Recording to Blockchain</h4>
            <p className="text-gray-600 mb-6">Creating immutable verification record...</p>
            
            <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">Blockchain Security</span>
              </div>
              <p className="text-xs text-blue-700">
                Your tool's condition is being permanently recorded on the blockchain, 
                ensuring tamper-proof verification for all future rentals.
              </p>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && verificationHash && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 mb-2">Verification Complete!</h4>
            <p className="text-gray-600 mb-6">
              Your tool's condition has been permanently recorded on the blockchain
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-600 mb-2">Blockchain Hash:</p>
              <p className="text-xs font-mono bg-white p-2 rounded border break-all">
                {verificationHash}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                <p className="font-medium">Timestamp</p>
                <p className="text-gray-600">{new Date().toLocaleString()}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <Shield className="h-4 w-4 text-green-500 mx-auto mb-1" />
                <p className="font-medium">Status</p>
                <p className="text-green-600">Verified</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button 
                onClick={shareVerification}
                className="btn-outline flex items-center justify-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button 
                onClick={downloadCertificate}
                className="btn-outline flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Certificate
              </button>
              <button 
                onClick={viewOnBlockchain}
                className="btn-primary flex items-center justify-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                View on Chain
              </button>
            </div>

            <button 
              onClick={startNewVerification}
              className="w-full mt-4 btn-outline"
            >
              Start New Verification
            </button>
          </motion.div>
        )}
      </div>

      {/* Verification History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification History</h3>
        
        {verificationHistory.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No verifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {verificationHistory.map((verification) => (
              <button
                key={verification.id}
                onClick={() => toast.success(`Verification from ${verification.date} - Hash: ${verification.hash.substring(0, 20)}...`)}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{verification.date}</p>
                    <p className="text-sm text-gray-600">{verification.photos} photos verified</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      verification.status === 'verified' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {verification.status}
                    </span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  {verification.hash.substring(0, 30)}...
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && verificationHash && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-sm w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Verification QR Code</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <QRCode value={verificationHash} size={200} />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan to verify tool condition on blockchain
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(verificationHash);
                  toast.success('Hash copied to clipboard!');
                }}
                className="w-full btn-primary"
              >
                Copy Hash
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BlockchainVerification;