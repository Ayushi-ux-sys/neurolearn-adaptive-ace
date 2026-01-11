import React, { useState, useRef } from 'react';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { motion } from 'framer-motion';
import { Eye, Upload, Camera, Sparkles, Lightbulb, Image, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function VisualLearningPage() {
  const { mode, playbackSpeed } = useLearningMode();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [explanation, setExplanation] = useState<{
    title: string;
    points: string[];
    tip: string;
    voiceDescription: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 4MB for base64)
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image too large. Please use an image under 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageBase64 = e.target?.result as string;
      setUploadedImage(imageBase64);
      setExplanation(null);
      await analyzeImage(imageBase64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageBase64: string) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            imageBase64,
            learningMode: mode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setExplanation({
        title: data.title || 'Visual Explanation',
        points: data.points || [],
        tip: data.tip || 'Keep exploring and learning!',
        voiceDescription: data.voiceDescription || data.title || 'Image analyzed successfully.',
      });

      toast.success('Image analyzed! 🎉');
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const speakDescription = () => {
    if (!explanation?.voiceDescription) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(explanation.voiceDescription);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setExplanation(null);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        {!uploadedImage && (
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
        )}

        {/* Uploaded Image Preview */}
        {uploadedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-neuro p-4 mb-6"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-foreground">Your Image</span>
              <button
                onClick={clearImage}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Upload New
              </button>
            </div>
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
            <p className="text-muted-foreground">AI is creating a personalized explanation</p>
          </motion.div>
        )}

        {/* AI Explanation */}
        {explanation && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-neuro p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">{explanation.title}</h2>
              </div>
              
              {/* Voice Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={speakDescription}
                className={`p-3 rounded-full transition-colors ${
                  isSpeaking 
                    ? 'bg-primary text-white' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </motion.button>
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

            {/* Playback Speed Info */}
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Voice playback speed: {playbackSpeed}x
              </p>
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
