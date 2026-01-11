import React from 'react';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { Trophy, BookOpen, Target, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function ProgressOverview() {
  const { progress } = useLearningMode();

  const xpToNextLevel = 100;
  const currentLevelXP = progress.totalXP % 100;
  const xpProgress = (currentLevelXP / xpToNextLevel) * 100;

  const stats = [
    {
      label: 'Lessons Done',
      value: progress.lessonsCompleted,
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Games Played',
      value: progress.gamesPlayed,
      icon: Target,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      label: 'Time Spent',
      value: `${progress.timeSpent}m`,
      icon: Clock,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      label: 'Accuracy',
      value: `${progress.accuracy}%`,
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-neuro p-6 bg-gradient-to-br from-card to-muted/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Your Progress</h3>
            <p className="text-sm text-muted-foreground">Keep up the great work!</p>
          </div>
        </div>
        <Link to="/progress">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-md"
          >
            See All
          </motion.button>
        </Link>
      </div>

      {/* Level Progress */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Level {progress.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentLevelXP} / {xpToNextLevel} XP
          </span>
        </div>
        <div className="progress-neuro">
          <motion.div
            className="progress-neuro-fill"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className={`${stat.bg} rounded-2xl p-4 text-center`}
          >
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
