import React, { useState, useRef } from 'react';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Star, Lock, Play, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const games = [
  {
    id: 'word-match',
    name: 'Word Match',
    description: 'Match words with their pictures',
    icon: '🎯',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    unlocked: true,
    skills: ['Reading', 'Memory'],
  },
  {
    id: 'spell-word',
    name: 'Spell the Word',
    description: 'Drag letters to spell words correctly',
    icon: '✏️',
    color: 'from-green-400 to-green-600',
    bg: 'bg-green-50',
    unlocked: true,
    skills: ['Spelling', 'Focus'],
  },
  {
    id: 'unscramble',
    name: 'Unscramble',
    description: 'Rearrange letters to form words',
    icon: '🔀',
    color: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-50',
    unlocked: true,
    skills: ['Problem Solving', 'Vocabulary'],
  },
  {
    id: 'memory-flip',
    name: 'Memory Flip',
    description: 'Find matching pairs of cards',
    icon: '🃏',
    color: 'from-orange-400 to-orange-600',
    bg: 'bg-orange-50',
    unlocked: false,
    skills: ['Memory', 'Focus'],
  },
  {
    id: 'sound-match',
    name: 'Sound Match',
    description: 'Match sounds to their words',
    icon: '🔊',
    color: 'from-pink-400 to-pink-600',
    bg: 'bg-pink-50',
    unlocked: false,
    skills: ['Listening', 'Phonics'],
  },
  {
    id: 'picture-word',
    name: 'Picture to Word',
    description: 'Type the word shown in the picture',
    icon: '🖼️',
    color: 'from-teal-400 to-teal-600',
    bg: 'bg-teal-50',
    unlocked: false,
    skills: ['Vocabulary', 'Spelling'],
  },
  {
    id: 'fast-tap',
    name: 'Fast Tap',
    description: 'Tap the correct answer quickly',
    icon: '⚡',
    color: 'from-yellow-400 to-yellow-600',
    bg: 'bg-yellow-50',
    unlocked: false,
    skills: ['Speed', 'Focus'],
  },
  {
    id: 'missing-letter',
    name: 'Missing Letter',
    description: 'Fill in the missing letters',
    icon: '🔤',
    color: 'from-indigo-400 to-indigo-600',
    bg: 'bg-indigo-50',
    unlocked: false,
    skills: ['Spelling', 'Reading'],
  },
  {
    id: 'rhyming-words',
    name: 'Rhyming Words',
    description: 'Find words that rhyme together',
    icon: '🎵',
    color: 'from-rose-400 to-rose-600',
    bg: 'bg-rose-50',
    unlocked: false,
    skills: ['Phonics', 'Vocabulary'],
  },
  {
    id: 'story-builder',
    name: 'Story Builder',
    description: 'Put sentences in order to make a story',
    icon: '📚',
    color: 'from-cyan-400 to-cyan-600',
    bg: 'bg-cyan-50',
    unlocked: false,
    skills: ['Comprehension', 'Sequencing'],
  },
];

export function GamesPage() {
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Word Games</h1>
              <p className="text-muted-foreground">Train your brain with fun games!</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {game.unlocked ? (
                <Link to={`/games/${game.id}`}>
                  <div className={`card-neuro p-5 ${game.bg} group cursor-pointer`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg text-2xl group-hover:scale-110 transition-transform`}>
                        {game.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1">{game.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{game.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {game.skills.map((skill) => (
                            <span key={skill} className="px-2 py-0.5 bg-white/70 rounded-full text-xs font-medium text-foreground">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Play className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className={`card-neuro p-5 bg-muted/50 opacity-60 cursor-not-allowed relative`}>
                  <div className="absolute top-3 right-3">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl grayscale">
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-muted-foreground mb-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground/70 mb-2">{game.description}</p>
                      <p className="text-xs text-primary">Complete more lessons to unlock!</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
