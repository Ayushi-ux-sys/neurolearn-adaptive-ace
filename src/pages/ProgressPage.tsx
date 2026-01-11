import React from 'react';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Flame, Target, Clock, TrendingUp, Award, 
  BookOpen, Gamepad2, Medal, Crown, Zap 
} from 'lucide-react';

export function ProgressPage() {
  const { progress, mode } = useLearningMode();

  const xpToNextLevel = 100;
  const currentLevelXP = progress.totalXP % 100;
  const xpProgress = (currentLevelXP / xpToNextLevel) * 100;

  const stats = [
    { label: 'Lessons Completed', value: progress.lessonsCompleted, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Games Played', value: progress.gamesPlayed, icon: Gamepad2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Time Learning', value: `${progress.timeSpent}m`, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Average Accuracy', value: `${progress.accuracy}%`, icon: Target, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Current Streak', value: `${progress.currentStreak} days`, icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Total XP', value: progress.totalXP, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ];

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: '👶', unlocked: progress.lessonsCompleted >= 1 },
    { id: 2, name: 'Bookworm', description: 'Complete 5 lessons', icon: '📚', unlocked: progress.lessonsCompleted >= 5 },
    { id: 3, name: 'Game Master', description: 'Play 3 games', icon: '🎮', unlocked: progress.gamesPlayed >= 3 },
    { id: 4, name: 'Rising Star', description: 'Reach Level 5', icon: '⭐', unlocked: progress.level >= 5 },
    { id: 5, name: 'On Fire', description: '3-day streak', icon: '🔥', unlocked: progress.currentStreak >= 3 },
    { id: 6, name: 'Champion', description: 'Earn 500 XP', icon: '🏆', unlocked: progress.totalXP >= 500 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Progress</h1>
              <p className="text-muted-foreground">Track your learning journey!</p>
            </div>
          </div>
        </motion.div>

        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-neuro p-6 mb-6 bg-gradient-to-r from-primary/10 to-accent/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {progress.level}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Level {progress.level}</h2>
                <p className="text-muted-foreground">
                  {progress.level < 5 ? 'Beginner Learner' : progress.level < 10 ? 'Rising Star' : 'Super Learner'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{progress.totalXP}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {progress.level + 1}</span>
              <span className="font-medium text-foreground">{currentLevelXP} / {xpToNextLevel} XP</span>
            </div>
            <div className="progress-neuro h-6">
              <motion.div
                className="progress-neuro-fill flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(xpProgress, 10)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Zap className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`card-neuro p-4 ${stat.bg}`}
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Medal className="w-6 h-6 text-yellow-500" />
            Achievements
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`card-neuro p-4 text-center ${
                  achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-muted/50 opacity-60'
                }`}
              >
                <span className={`text-4xl ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </span>
                <h3 className={`font-bold mt-2 ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <Award className="w-3 h-3" />
                    Unlocked!
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
