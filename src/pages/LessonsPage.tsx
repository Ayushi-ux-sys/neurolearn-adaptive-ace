import React, { useState } from 'react';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Star, Lock } from 'lucide-react';

const grades = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Class ${i + 1}`,
  isLocked: false, // All classes unlocked
  stars: Math.floor(Math.random() * 4),
}));

const subjects = [
  { id: 'math', name: 'Math', icon: '🔢', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'from-green-400 to-green-600', bg: 'bg-green-50' },
  { id: 'english', name: 'English', icon: '📖', color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
  { id: 'social', name: 'Social Studies', icon: '🌍', color: 'from-orange-400 to-orange-600', bg: 'bg-orange-50' },
];

export function LessonsPage() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Lessons</h1>
              <p className="text-muted-foreground">Choose your class and subject</p>
            </div>
          </div>
        </motion.div>

        {!selectedGrade ? (
          /* Grade Selection */
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {grades.map((grade, index) => (
              <motion.button
                key={grade.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !grade.isLocked && setSelectedGrade(grade.id)}
                disabled={grade.isLocked}
                className={`
                  relative p-4 md:p-6 rounded-2xl border-2 transition-all
                  ${grade.isLocked 
                    ? 'bg-muted border-muted cursor-not-allowed opacity-60' 
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-lg cursor-pointer'
                  }
                `}
              >
                {grade.isLocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {grade.id}
                </p>
                <p className="text-xs text-muted-foreground">Class</p>
                
                {!grade.isLocked && (
                  <div className="flex gap-0.5 mt-2 justify-center">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= grade.stars
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          /* Subject Selection */
          <div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedGrade(null)}
              className="mb-6 text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              ← Back to Classes
            </motion.button>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-foreground mb-4"
            >
              Class {selectedGrade} Subjects
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/lessons/${selectedGrade}/${subject.id}`}>
                    <div className={`card-neuro p-6 ${subject.bg} group cursor-pointer`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">{subject.icon}</span>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{subject.name}</h3>
                            <p className="text-sm text-muted-foreground">10 lessons available</p>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
