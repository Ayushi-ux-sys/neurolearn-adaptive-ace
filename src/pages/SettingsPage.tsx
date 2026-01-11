import React from 'react';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { useLearningMode, LearningMode } from '@/contexts/LearningModeContext';
import { motion } from 'framer-motion';
import { Settings, BookOpen, Zap, Compass, Volume2, Trash2, RotateCcw } from 'lucide-react';

export function SettingsPage() {
  const { mode, setMode, setIsOnboarded, playbackSpeed, setPlaybackSpeed } = useLearningMode();

  const modes = [
    { id: 'dyslexia' as LearningMode, name: 'Reading Helper', icon: BookOpen, color: 'from-blue-400 to-cyan-400', description: 'Easy fonts & read-aloud' },
    { id: 'adhd' as LearningMode, name: 'Focus Mode', icon: Zap, color: 'from-orange-400 to-amber-400', description: 'Quick lessons & games' },
    { id: 'explore' as LearningMode, name: 'Explorer', icon: Compass, color: 'from-purple-400 to-pink-400', description: 'All features available' },
  ];

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Customize your learning experience</p>
            </div>
          </div>
        </motion.div>

        {/* Learning Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-neuro p-6 mb-6"
        >
          <h2 className="font-bold text-foreground mb-4">Learning Mode</h2>
          <div className="space-y-3">
            {modes.map((m) => (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setMode(m.id)}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                  mode === m.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted border-2 border-transparent hover:border-primary/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                  <m.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-foreground">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </div>
                {mode === m.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-sm">✓</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Default Playback Speed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-neuro p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Default Playback Speed</h2>
          </div>
          <div className="flex flex-wrap gap-2">
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
        </motion.div>

        {/* Reset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-neuro p-6"
        >
          <h2 className="font-bold text-foreground mb-4">Data & Privacy</h2>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setIsOnboarded(false);
            }}
            className="w-full p-4 rounded-2xl bg-muted flex items-center gap-4 mb-3 hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-muted-foreground" />
            <div className="text-left">
              <p className="font-medium text-foreground">Restart Onboarding</p>
              <p className="text-sm text-muted-foreground">Go through the welcome screen again</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="w-full p-4 rounded-2xl bg-destructive/10 flex items-center gap-4 hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-6 h-6 text-destructive" />
            <div className="text-left">
              <p className="font-medium text-destructive">Reset All Progress</p>
              <p className="text-sm text-destructive/70">Delete all data and start fresh</p>
            </div>
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
