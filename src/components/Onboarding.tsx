import React from 'react';
import { useLearningMode, LearningMode } from '@/contexts/LearningModeContext';
import { BookOpen, Zap, Compass, Sparkles, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const modeOptions = [
  {
    id: 'dyslexia' as LearningMode,
    title: 'I learn differently with reading',
    subtitle: 'Dyslexia Support',
    description: 'Big text, easy fonts, and read-aloud help',
    icon: BookOpen,
    color: 'from-blue-400 to-cyan-400',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: ['Easy-to-read fonts', 'Listen to lessons', 'Picture dictionary'],
  },
  {
    id: 'adhd' as LearningMode,
    title: 'I like quick, fun learning',
    subtitle: 'ADHD Support',
    description: 'Short lessons, games, and rewards',
    icon: Zap,
    color: 'from-orange-400 to-amber-400',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    features: ['5-minute lessons', 'Earn points & badges', 'Fun games'],
  },
  {
    id: 'explore' as LearningMode,
    title: 'Let me explore everything!',
    subtitle: 'Explore Mode',
    description: 'Try all features and find what works best',
    icon: Compass,
    color: 'from-purple-400 to-pink-400',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: ['All features available', 'Switch modes anytime', 'Personalized tips'],
  },
];

export function Onboarding() {
  const { setMode, setIsOnboarded } = useLearningMode();

  const handleSelectMode = (mode: LearningMode) => {
    setMode(mode);
    setIsOnboarded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-warning rounded-full flex items-center justify-center"
            >
              <Star className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
          Welcome to <span className="text-primary">NeuroLearn</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
          Your friendly AI learning buddy! 🎓
        </p>
      </motion.div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-card rounded-full px-6 py-3 shadow-md border border-border">
          <Heart className="w-5 h-5 text-destructive" />
          <span className="text-lg font-medium text-foreground">
            How do you learn best?
          </span>
        </div>
      </motion.div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl">
        {modeOptions.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            onClick={() => handleSelectMode(option.id)}
            className={`
              relative p-6 md:p-8 rounded-3xl border-2 ${option.borderColor} ${option.bgColor}
              transition-all duration-300 text-left group
              hover:shadow-2xl hover:scale-[1.02] hover:border-primary/50
              focus:outline-none focus:ring-4 focus:ring-primary/30
            `}
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <option.icon className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {option.subtitle}
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-foreground">
                {option.title}
              </h3>
              <p className="text-muted-foreground">
                {option.description}
              </p>
            </div>

            {/* Features */}
            <div className="mt-4 space-y-2">
              {option.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.color}`} />
                  {feature}
                </div>
              ))}
            </div>

            {/* Hover indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg`}>
                <span className="text-white text-xl">→</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        ✨ You can change this anytime in settings
      </motion.p>
    </div>
  );
}
