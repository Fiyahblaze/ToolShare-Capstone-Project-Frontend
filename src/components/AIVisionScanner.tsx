import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, X, Zap, Target, ArrowRight } from 'lucide-react';
import Webcam from 'react-webcam';
import { useToolStore } from '../store/toolStore';
import toast from 'react-hot-toast';

interface AIVisionScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onToolsFound: (analysis: string) => void;
}

const AIVisionScanner: React.FC<AIVisionScannerProps> = ({ isOpen, onClose, onToolsFound }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const { tools } = useToolStore();

  const analyzeImage = useCallback(async (_imageSrc: string) => {
    setIsScanning(true);
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock AI analysis results based on common scenarios
    const scenarios = [
      {
        problem: "Leaky pipe joint",
        tools: ["Pipe Wrench", "Plumber's Tape", "Pipe Cutter"],
        analysis: "I detected a pipe joint leak. You'll need a pipe wrench to tighten connections, plumber's tape for sealing, and possibly a pipe cutter if replacement is needed.",
        confidence: 92
      },
      {
        problem: "Wall painting project",
        tools: ["Paint Roller", "Paint Brushes", "Drop Cloths", "Paint Sprayer"],
        analysis: "This looks like a wall that needs painting. I recommend a paint roller for large areas, brushes for detail work, drop cloths for protection, and consider a paint sprayer for efficiency.",
        confidence: 88
      },
      {
        problem: "Deck construction",
        tools: ["Circular Saw", "Drill", "Level", "Measuring Tape"],
        analysis: "I see deck construction materials. You'll need a circular saw for cutting lumber, a drill for fasteners, a level for proper alignment, and measuring tape for accuracy.",
        confidence: 95
      },
      {
        problem: "Garden maintenance",
        tools: ["Lawn Mower", "Hedge Trimmer", "Leaf Blower", "Garden Tools"],
        analysis: "Your garden needs maintenance! A lawn mower for grass, hedge trimmer for bushes, leaf blower for cleanup, and basic garden tools for planting.",
        confidence: 90
      }
    ];

    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Find matching tools from our inventory
    const matchingTools = tools.filter(tool => 
      randomScenario.tools.some(neededTool => 
        tool.title.toLowerCase().includes(neededTool.toLowerCase()) ||
        tool.category.toLowerCase().includes(neededTool.toLowerCase())
      )
    );

    setScanResult(randomScenario.problem);
    setConfidence(randomScenario.confidence);
    setIsScanning(false);
    
    onToolsFound(randomScenario.analysis);
    
    toast.success(`Found ${matchingTools.length} matching tools nearby!`);
  }, [tools, onToolsFound]);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      analyzeImage(imageSrc);
    }
  }, [analyzeImage]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Vision Scanner</h3>
                    <p className="text-sm opacity-90">Point at your project to find tools</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Camera View */}
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-64 object-cover"
                videoConstraints={{
                  width: 400,
                  height: 300,
                  facingMode: "environment"
                }}
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanning Frame */}
                  <div className="w-48 h-48 border-2 border-primary-400 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-400 rounded-br-lg"></div>
                    
                    {/* Scanning Animation */}
                    {isScanning && (
                      <motion.div
                        initial={{ y: -48 }}
                        animate={{ y: 48 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent"
                      />
                    )}
                  </div>
                  
                  {/* Center Target */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Target className="h-8 w-8 text-primary-400" />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 text-white p-3 rounded-lg text-center">
                  <p className="text-sm">
                    {isScanning ? 'Analyzing your project...' : 'Position your project in the frame'}
                  </p>
                </div>
              </div>
            </div>

            {/* Results */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border-t border-green-200"
              >
                <div className="flex items-center mb-2">
                  <Zap className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-800">Analysis Complete</span>
                  <span className="ml-auto text-sm text-green-600">{confidence}% confident</span>
                </div>
                <p className="text-sm text-green-700 mb-3">{scanResult}</p>
                <button
                  onClick={onClose}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium flex items-center justify-center"
                >
                  View Recommended Tools
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </motion.div>
            )}

            {/* Controls */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={capturePhoto}
                  disabled={isScanning}
                  className="bg-primary-600 text-white p-4 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isScanning ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="h-6 w-6" />
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-gray-600 mt-2">
                Tap to scan and find the perfect tools
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIVisionScanner;