import React, { useState, useRef } from 'react';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { motion } from 'framer-motion';
import { Eye, Upload, Camera, Loader2, Sparkles, Lightbulb, Image } from 'lucide-react';

export function VisualLearningPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [explanation, setExplanation] = useState<{
    title: string;
    points: string[];
    tip: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setExplanation({
        title: 'Visual Explanation',
        points: [
          '🔍 This image shows important concepts that can help you learn better',
          '📝 The key elements are organized to make understanding easier',
          '🎯 Focus on the main idea first, then look at the details',
          '💡 Try connecting what you see to things you already know',
        ],
        tip: 'Visual learning helps your brain remember things longer! Try drawing what you learn.',
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Visual Learning</h1>
              <p className="text-muted-foreground">Learn from images with AI explanations</p>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-neuro p-6 mb-6"
        >
          <h2 className="font-bold text-foreground mb-4">Upload an Image</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCameraCapture}
              className="p-8 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors text-center"
            >
              <Camera className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <p className="font-medium text-foreground">Take Photo</p>
              <p className="text-xs text-muted-foreground mt-1">Use your camera</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="p-8 bg-purple-50 rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors text-center"
            >
              <Upload className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <p className="font-medium text-foreground">Upload Image</p>
              <p className="text-xs text-muted-foreground mt-1">From your device</p>
            </motion.button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
        </motion.div>

        {/* Uploaded Image Preview */}
        {uploadedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-neuro p-4 mb-6"
          >
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full rounded-2xl object-cover max-h-64"
            />
          </motion.div>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-neuro p-8 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-lg font-medium text-foreground">Analyzing your image...</p>
            <p className="text-muted-foreground">AI is creating a visual explanation</p>
          </motion.div>
        )}

        {/* AI Explanation */}
        {explanation && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-neuro p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">{explanation.title}</h2>
            </div>

            <ul className="space-y-3 mb-6">
              {explanation.points.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-muted rounded-xl"
                >
                  <span className="text-foreground">{point}</span>
                </motion.li>
              ))}
            </ul>

            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-700">Learning Tip</span>
              </div>
              <p className="text-yellow-700">{explanation.tip}</p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!uploadedImage && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-8"
          >
            <Image className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">
              Upload or capture an image to get started!
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Take a picture of your notes, textbook, or anything you want to understand better
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
