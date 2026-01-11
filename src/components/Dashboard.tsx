import React from 'react';
import { Header } from '@/components/layout/Header';
import { FeatureCard } from '@/components/home/FeatureCard';
import { ProgressOverview } from '@/components/home/ProgressOverview';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { 
  BookOpen, 
  Volume2, 
  Eye, 
  Mic, 
  Gamepad2, 
  Trophy,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Lessons',
    description: 'Learn Math, Science, English & more with fun, easy lessons',
    icon: BookOpen,
    to: '/lessons',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50/50',
  },
  {
    title: 'Read Aloud',
    description: 'Upload photos or documents and listen to them being read',
    icon: Volume2,
    to: '/read-aloud',
    color: 'from-green-400 to-emerald-600',
    bgColor: 'bg-green-50/50',
  },
  {
    title: 'Visual Learning',
    description: 'Take pictures of anything and get visual explanations',
    icon: Eye,
    to: '/visual-learning',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50/50',
  },
  {
    title: 'Audio Notes',
    description: 'Record, save, and replay your voice notes anytime',
    icon: Mic,
    to: '/audio',
    color: 'from-red-400 to-rose-600',
    bgColor: 'bg-red-50/50',
  },
  {
    title: 'Word Games',
    description: 'Play fun brain games to improve reading & memory',
    icon: Gamepad2,
    to: '/games',
    color: 'from-orange-400 to-amber-600',
    bgColor: 'bg-orange-50/50',
  },
  {
    title: 'My Progress',
    description: 'See your achievements, badges, and learning journey',
    icon: Trophy,
    to: '/progress',
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-50/50',
  },
];

export function Dashboard() {
  const { mode } = useLearningMode();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getModeMessage = () => {
    switch (mode) {
      case 'dyslexia':
        return "Let's read and learn together! 📚";
      case 'adhd':
        return "Ready for quick fun learning? ⚡";
      default:
        return "Explore and discover new things! 🌟";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {getGreeting()}, Learner!
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">{getModeMessage()}</p>
        </motion.div>

        {/* Progress Overview */}
        <div className="mb-8">
          <ProgressOverview />
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span>Start Learning</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={0.1 * index}
              />
            ))}
          </div>
        </motion.div>

        {/* Mode-specific tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">Tip of the Day</h4>
              {mode === 'dyslexia' && (
                <p className="text-muted-foreground">
                  Try using the Read Aloud feature! It can read any text to you at your own pace. 
                  Use the speed controls to find what works best for you.
                </p>
              )}
              {mode === 'adhd' && (
                <p className="text-muted-foreground">
                  Take short breaks between lessons! The focus timer will help you stay on track.
                  Remember: 5-minute lessons = Big achievements! 🏆
                </p>
              )}
              {mode === 'explore' && (
                <p className="text-muted-foreground">
                  Explore all the features! Try Word Games to sharpen your mind, 
                  or use Visual Learning to understand tricky concepts better.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
