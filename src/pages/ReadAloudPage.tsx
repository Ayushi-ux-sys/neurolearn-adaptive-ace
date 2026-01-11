import React, { useState, useRef } from 'react';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { motion } from 'framer-motion';
import { Volume2, Upload, Camera, Play, Pause, RotateCcw, Loader2, FileText, Image } from 'lucide-react';

export function ReadAloudPage() {
  const { playbackSpeed, setPlaybackSpeed } = useLearningMode();
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleSpeak = () => {
    if (!text) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.onend = () => setIsPlaying(false);
    speechRef.current = utterance;
    
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadedFile(file.name);

    // For demo, simulate text extraction
    setTimeout(() => {
      if (file.type.includes('image')) {
        setText('This is sample text extracted from the uploaded image. In a real app, this would use OCR technology to read text from images!');
      } else {
        setText('This is sample text extracted from the uploaded document. In a real app, this would parse PDFs and documents to extract their content.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Read Aloud</h1>
              <p className="text-muted-foreground">Upload or type text to hear it read</p>
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
          <h2 className="font-bold text-foreground mb-4">Upload a file</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="p-6 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors text-center"
            >
              <FileText className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-foreground">Upload Document</p>
              <p className="text-xs text-muted-foreground">PDF, DOC, TXT</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="p-6 bg-purple-50 rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors text-center"
            >
              <Image className="w-10 h-10 text-purple-500 mx-auto mb-2" />
              <p className="font-medium text-foreground">Upload Image</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, HEIC</p>
            </motion.button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />

          {uploadedFile && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">{uploadedFile}</span>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto" />}
            </div>
          )}
        </motion.div>

        {/* Text Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-neuro p-6 mb-6"
        >
          <h2 className="font-bold text-foreground mb-4">Or type/paste text</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste any text here and I'll read it aloud for you..."
            className="w-full h-40 p-4 bg-muted rounded-2xl border-2 border-border focus:border-primary resize-none text-foreground placeholder:text-muted-foreground"
          />
        </motion.div>

        {/* Playback Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-neuro p-6"
        >
          <h2 className="font-bold text-foreground mb-4">Playback Speed</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {speedOptions.map((speed) => (
              <motion.button
                key={speed}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  playbackSpeed === speed
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {speed}x
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSpeak}
              disabled={!text}
              className="flex-1 btn-child-friendly bg-primary text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-6 h-6" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Read Aloud
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                speechSynthesis.cancel();
                setIsPlaying(false);
                setText('');
                setUploadedFile(null);
              }}
              className="btn-child-friendly bg-secondary text-secondary-foreground"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
