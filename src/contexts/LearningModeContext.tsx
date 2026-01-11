import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LearningMode = 'dyslexia' | 'adhd' | 'explore' | null;

interface UserProgress {
  lessonsCompleted: number;
  totalXP: number;
  currentStreak: number;
  badges: string[];
  gamesPlayed: number;
  accuracy: number;
  timeSpent: number; // in minutes
  level: number;
}

interface LearningModeContextType {
  mode: LearningMode;
  setMode: (mode: LearningMode) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  addXP: (amount: number) => void;
  completeLesson: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

const defaultProgress: UserProgress = {
  lessonsCompleted: 0,
  totalXP: 0,
  currentStreak: 1,
  badges: [],
  gamesPlayed: 0,
  accuracy: 0,
  timeSpent: 0,
  level: 1,
};

const LearningModeContext = createContext<LearningModeContextType | undefined>(undefined);

export function LearningModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LearningMode>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('neurolearn-mode') as LearningMode;
    const savedOnboarded = localStorage.getItem('neurolearn-onboarded');
    const savedProgress = localStorage.getItem('neurolearn-progress');
    const savedSpeed = localStorage.getItem('neurolearn-playback-speed');

    if (savedMode) setModeState(savedMode);
    if (savedOnboarded === 'true') setIsOnboarded(true);
    if (savedProgress) setProgress(JSON.parse(savedProgress));
    if (savedSpeed) setPlaybackSpeed(parseFloat(savedSpeed));
  }, []);

  // Apply mode class to document
  useEffect(() => {
    document.documentElement.classList.remove('mode-dyslexia', 'mode-adhd');
    if (mode === 'dyslexia') {
      document.documentElement.classList.add('mode-dyslexia');
    } else if (mode === 'adhd') {
      document.documentElement.classList.add('mode-adhd');
    }
  }, [mode]);

  const setMode = (newMode: LearningMode) => {
    setModeState(newMode);
    if (newMode) {
      localStorage.setItem('neurolearn-mode', newMode);
    }
  };

  const handleSetIsOnboarded = (value: boolean) => {
    setIsOnboarded(value);
    localStorage.setItem('neurolearn-onboarded', value.toString());
  };

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => {
      const newProgress = { ...prev, ...updates };
      localStorage.setItem('neurolearn-progress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const addXP = (amount: number) => {
    setProgress(prev => {
      const newXP = prev.totalXP + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const newProgress = { ...prev, totalXP: newXP, level: newLevel };
      localStorage.setItem('neurolearn-progress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const completeLesson = () => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        lessonsCompleted: prev.lessonsCompleted + 1,
      };
      localStorage.setItem('neurolearn-progress', JSON.stringify(newProgress));
      return newProgress;
    });
    addXP(25);
  };

  const handleSetPlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    localStorage.setItem('neurolearn-playback-speed', speed.toString());
  };

  return (
    <LearningModeContext.Provider
      value={{
        mode,
        setMode,
        isOnboarded,
        setIsOnboarded: handleSetIsOnboarded,
        progress,
        updateProgress,
        addXP,
        completeLesson,
        playbackSpeed,
        setPlaybackSpeed: handleSetPlaybackSpeed,
      }}
    >
      {children}
    </LearningModeContext.Provider>
  );
}

export function useLearningMode() {
  const context = useContext(LearningModeContext);
  if (context === undefined) {
    throw new Error('useLearningMode must be used within a LearningModeProvider');
  }
  return context;
}
