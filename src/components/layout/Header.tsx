import React from 'react';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { Sparkles, Star, Flame, Award, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Header() {
  const { mode, progress } = useLearningMode();

  const getModeLabel = () => {
    switch (mode) {
      case 'dyslexia': return 'Reading Helper';
      case 'adhd': return 'Focus Mode';
      default: return 'Explorer';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'dyslexia': return 'from-blue-400 to-cyan-400';
      case 'adhd': return 'from-orange-400 to-amber-400';
      default: return 'from-purple-400 to-pink-400';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getModeColor()} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">NeuroLearn</h1>
              <p className="text-xs text-muted-foreground">{getModeLabel()}</p>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Streak */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-200"
            >
              <Flame className="w-4 h-4" />
              <span className="text-sm font-semibold">{progress.currentStreak}</span>
            </motion.div>

            {/* XP */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full border border-yellow-200"
            >
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">{progress.totalXP}</span>
            </motion.div>

            {/* Level */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-1.5 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full border border-purple-200"
            >
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">Lvl {progress.level}</span>
            </motion.div>

            {/* Settings */}
            <Link to="/settings">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
