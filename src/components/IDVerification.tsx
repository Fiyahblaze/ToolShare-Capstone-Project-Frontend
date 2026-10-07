import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  User, 
  CreditCard,
  Eye,
  RefreshCw
} from 'lucide-react';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';

interface IDVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (verificationData: any) => void;
  purpose: 'posting' | 'renting';
}

const IDVerification: React.FC<IDVerificationProps> = ({
  isOpen,
  onClose,
  onVerificationComplete,
  purpose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [idImage, setIdImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [_isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'id' | 'selfie'>('id');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [idType, setIdType] = useState<'drivers_license' | 'passport' | 'state_id'>('drivers_license');
  
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 1, title: 'ID Document', icon: CreditCard },
    { number: 2, title: 'Photo Verification', icon: Camera },
    { number: 3, title: 'Processing', icon: Shield },
    { number: 4, title: 'Complete', icon: CheckCircle },
  ];

  const idTypes = [
    { value: 'drivers_license', label: "Driver's License", description: 'Valid state-issued driver\'s license' },
    { value: 'state_id', label: 'State ID', description: 'Government-issued state identification' },
    { value: 'passport', label: 'Passport', description: 'Valid passport (photo page)' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (cameraMode === 'id') {
          setIdImage(imageUrl);
          toast.success('ID document uploaded successfully');
        } else {
          setSelfieImage(imageUrl);
          toast.success('Selfie uploaded successfully');
        }
        setShowCamera(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      if (cameraMode === 'id') {
        setIdImage(imageSrc);
        toast.success('ID document captured successfully');
      } else {
        setSelfieImage(imageSrc);
        toast.success('Selfie captured successfully');
      }
      setShowCamera(false);
    }
  };

  const startCamera = (mode: 'id' | 'selfie') => {
    setCameraMode(mode);
    setShowCamera(true);
  };

  const processVerification = async () => {
    if (!idImage || !selfieImage) {
      toast.error('Please provide both ID document and selfie');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(3);

    // Simulate AI verification process
    const verificationSteps = [
      'Analyzing ID document...',
      'Extracting personal information...',
      'Verifying document authenticity...',
      'Comparing facial features...',
      'Running biometric analysis...',
      'Cross-referencing databases...',
      'Generating verification report...'
    ];

    for (let i = 0; i < verificationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success(verificationSteps[i]);
    }

    // Mock verification result
    const mockResult = {
      verified: Math.random() > 0.1, // 90% success rate
      confidence: Math.floor(85 + Math.random() * 15), // 85-100% confidence
      documentType: idType,
      extractedInfo: {
        name: 'John Doe',
        dateOfBirth: '1990-05-15',
        documentNumber: 'D123456789',
        expirationDate: '2028-05-15',
        state: 'California'
      },
      biometricMatch: Math.random() > 0.05, // 95% match rate
      documentAuthenticity: Math.random() > 0.02, // 98% authentic rate
      riskScore: Math.floor(Math.random() * 20), // 0-20 risk score (lower is better)
      verificationId: `VER-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setVerificationResult(mockResult);
    setIsProcessing(false);
    setCurrentStep(4);

    if (mockResult.verified) {
      toast.success('🎉 Verification completed successfully!');
      onVerificationComplete(mockResult);
    } else {
      toast.error('Verification failed. Please try again with clearer images.');
    }
  };

  const retryVerification = () => {
    setCurrentStep(1);
    setIdImage(null);
    setSelfieImage(null);
    setVerificationResult(null);
    setIsProcessing(false);
    toast.success('Starting new verification process');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Identity Verification</h3>
                <p className="text-sm text-gray-600">
                  Required for {purpose === 'posting' ? 'posting tools' : 'renting tools'} - keeps our community safe
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: ID Document */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload ID Document</h4>
                
                {/* ID Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select ID Type
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {idTypes.map((type) => (
                      <label key={type.value} className="relative">
                        <input
                          type="radio"
                          value={type.value}
                          checked={idType === type.value}
                          onChange={(e) => setIdType(e.target.value as any)}
                          className="sr-only peer"
                        />
                        <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{type.label}</p>
                              <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upload Options */}
                {!idImage ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Take a clear photo of your {idTypes.find(t => t.value === idType)?.label.toLowerCase()}
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => startCamera('id')}
                          className="btn-primary flex items-center"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-outline flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload File
                        </button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-1">Photo Requirements:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Clear, well-lit image</li>
                            <li>All text must be readable</li>
                            <li>No glare or shadows</li>
                            <li>Document must be flat and fully visible</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={idImage}
                        alt="ID Document"
                        className="w-full max-w-md mx-auto rounded-lg"
                      />
                    </div>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => setIdImage(null)}
                        className="btn-outline flex items-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retake
                      </button>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="btn-primary"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Selfie */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Take a Selfie</h4>
                
                {!selfieImage ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Take a clear selfie to verify your identity matches your ID
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => startCamera('selfie')}
                          className="btn-primary flex items-center"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Take Selfie
                        </button>
                        <button
                          onClick={() => {
                            setCameraMode('selfie');
                            fileInputRef.current?.click();
                          }}
                          className="btn-outline flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Eye className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Selfie Requirements:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Face clearly visible and centered</li>
                            <li>Good lighting, no shadows</li>
                            <li>Remove glasses if possible</li>
                            <li>Neutral expression, eyes open</li>
                            <li>No hats or face coverings</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={selfieImage}
                        alt="Selfie"
                        className="w-64 h-64 object-cover mx-auto rounded-lg"
                      />
                    </div>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => setSelfieImage(null)}
                        className="btn-outline flex items-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retake
                      </button>
                      <button
                        onClick={processVerification}
                        className="btn-primary"
                      >
                        Verify Identity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Processing */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Verifying Your Identity</h4>
              <p className="text-gray-600 mb-6">
                Our AI is analyzing your documents and comparing your photos...
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">Secure Processing</span>
                </div>
                <p className="text-xs text-blue-700">
                  Your data is encrypted and processed securely. We never store your ID images permanently.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && verificationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {verificationResult.verified ? (
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Verification Successful!</h4>
                  <p className="text-gray-600 mb-6">
                    Your identity has been verified. You can now {purpose === 'posting' ? 'post tools' : 'rent tools'} on ToolShare.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Confidence Score:</span>
                        <p className="font-semibold text-green-600">{verificationResult.confidence}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Verification ID:</span>
                        <p className="font-mono text-xs">{verificationResult.verificationId}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Document Type:</span>
                        <p className="font-medium">{idTypes.find(t => t.value === verificationResult.documentType)?.label}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Risk Score:</span>
                        <p className={`font-semibold ${verificationResult.riskScore < 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {verificationResult.riskScore}/100
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-800">Verification Complete</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✓ Document authenticity confirmed</li>
                      <li>✓ Biometric match successful</li>
                      <li>✓ Identity verified and secure</li>
                    </ul>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full btn-primary"
                  >
                    Continue to {purpose === 'posting' ? 'Post Tool' : 'Rent Tool'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Verification Failed</h4>
                  <p className="text-gray-600 mb-6">
                    We couldn't verify your identity. Please try again with clearer images.
                  </p>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-700">
                      Common issues: blurry images, poor lighting, or document not fully visible.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={retryVerification}
                      className="flex-1 btn-primary"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Camera Modal */}
        <AnimatePresence>
          {showCamera && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {cameraMode === 'id' ? 'Capture ID Document' : 'Take Selfie'}
                    </h4>
                    <button
                      onClick={() => setShowCamera(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full"
                    videoConstraints={{
                      width: 400,
                      height: 300,
                      facingMode: cameraMode === 'selfie' ? 'user' : 'environment'
                    }}
                  />
                </div>

                <div className="p-4">
                  <button
                    onClick={capturePhoto}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Capture
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </motion.div>
    </div>
  );
};

export default IDVerification;