import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star, ArrowRight, Trophy, Lightbulb, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Sample questions for demo
const sampleQuestions = {
  math: [
    {
      id: 1,
      type: 'mcq',
      question: 'What is 5 + 3?',
      options: ['6', '7', '8', '9'],
      correct: 2,
      difficulty: 'easy',
      hint: 'Count on your fingers: 5... then add 3 more!',
    },
    {
      id: 2,
      type: 'mcq',
      question: 'Which number comes after 10?',
      options: ['9', '10', '11', '12'],
      correct: 2,
      difficulty: 'easy',
      hint: 'Think about counting: 9, 10, ???',
    },
    {
      id: 3,
      type: 'mcq',
      question: 'What is 10 - 4?',
      options: ['4', '5', '6', '7'],
      correct: 2,
      difficulty: 'medium',
      hint: 'Start at 10 and count backwards 4 times.',
    },
    {
      id: 4,
      type: 'mcq',
      question: 'What is 2 × 3?',
      options: ['4', '5', '6', '8'],
      correct: 2,
      difficulty: 'medium',
      hint: '2 groups of 3: 🍎🍎🍎 + 🍎🍎🍎',
    },
    {
      id: 5,
      type: 'mcq',
      question: 'What is 12 ÷ 4?',
      options: ['2', '3', '4', '6'],
      correct: 1,
      difficulty: 'hard',
      hint: 'How many groups of 4 can you make from 12?',
    },
  ],
  science: [
    {
      id: 1,
      type: 'mcq',
      question: 'What do plants need to grow?',
      options: ['Only water', 'Sunlight, water & air', 'Just soil', 'Only love'],
      correct: 1,
      difficulty: 'easy',
      hint: 'Plants are living things that need many things to survive.',
    },
    {
      id: 2,
      type: 'mcq',
      question: 'What is the largest planet in our solar system?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      correct: 2,
      difficulty: 'medium',
      hint: 'This planet is so big it could fit 1,300 Earths inside it!',
    },
  ],
  english: [
    {
      id: 1,
      type: 'mcq',
      question: 'Which word rhymes with "cat"?',
      options: ['Dog', 'Hat', 'Cup', 'Pig'],
      correct: 1,
      difficulty: 'easy',
      hint: 'Rhyming words sound the same at the end. Cat... ___at!',
    },
    {
      id: 2,
      type: 'mcq',
      question: 'What is the opposite of "happy"?',
      options: ['Sad', 'Angry', 'Sleepy', 'Hungry'],
      correct: 0,
      difficulty: 'easy',
      hint: 'When you\'re not happy, you feel ___.',
    },
  ],
  social: [
    {
      id: 1,
      type: 'mcq',
      question: 'What is the capital of India?',
      options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
      correct: 1,
      difficulty: 'easy',
      hint: 'This city has "Delhi" in its name but with a word before it.',
    },
  ],
};

export function LessonQuiz() {
  const { gradeId, subjectId } = useParams();
  const navigate = useNavigate();
  const { mode, addXP, completeLesson } = useLearningMode();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const questions = sampleQuestions[subjectId as keyof typeof sampleQuestions] || sampleQuestions.math;
  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === question.correct) {
      setScore(score + 1);
      addXP(10);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setIsComplete(true);
      completeLesson();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-xl"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              Amazing Work! 🎉
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              You completed the lesson!
            </p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3].map((star) => (
                <motion.div
                  key={star}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + star * 0.1 }}
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= Math.ceil((score / questions.length) * 3)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            <div className="bg-card rounded-2xl p-6 mb-8 border border-border">
              <p className="text-4xl font-bold text-primary mb-2">
                {score} / {questions.length}
              </p>
              <p className="text-muted-foreground">Questions correct</p>
              <p className="text-sm text-green-500 mt-2">+{score * 10} XP earned!</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/games')}
                className="btn-child-friendly bg-accent text-accent-foreground"
              >
                Play Word Games 🎮
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/lessons')}
                className="btn-child-friendly bg-primary text-primary-foreground"
              >
                More Lessons 📚
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <BackButton />

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {score} correct
            </span>
          </div>
          <div className="progress-neuro">
            <motion.div
              className="progress-neuro-fill"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-neuro p-6 md:p-8"
        >
          {/* Difficulty Badge */}
          <div className="flex justify-between items-center mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>

            {mode === 'dyslexia' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => speakText(question.question)}
                className="p-2 rounded-full bg-primary/10 text-primary"
              >
                <Volume2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`
                  w-full p-4 rounded-2xl text-left font-medium transition-all
                  flex items-center justify-between
                  ${showResult
                    ? index === question.correct
                      ? 'bg-green-100 border-2 border-green-500 text-green-700'
                      : index === selectedAnswer
                        ? 'bg-red-100 border-2 border-red-500 text-red-700'
                        : 'bg-muted border-2 border-transparent'
                    : selectedAnswer === index
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-card border-2 border-border hover:border-primary/50'
                  }
                `}
              >
                <span>{option}</span>
                {showResult && index === question.correct && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {showResult && index === selectedAnswer && index !== question.correct && (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Hint Button */}
          {!showResult && !showHint && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowHint(true)}
              className="mt-4 flex items-center gap-2 text-primary font-medium"
            >
              <Lightbulb className="w-4 h-4" />
              Need a hint?
            </motion.button>
          )}

          {/* Hint */}
          <AnimatePresence>
            {showHint && !showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-700">{question.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Message */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
                }`}
              >
                <p className={`font-bold ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                  {isCorrect ? '🎉 Great job!' : '💪 Keep trying!'}
                </p>
                <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
                  {isCorrect 
                    ? `+10 XP earned!` 
                    : `The correct answer was: ${question.options[question.correct]}`
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {showResult && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="mt-6 w-full btn-child-friendly bg-primary text-primary-foreground flex items-center justify-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  See Results
                  <Trophy className="w-5 h-5" />
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </main>
    </div>
  );
}
