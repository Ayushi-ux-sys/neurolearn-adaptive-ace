import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

// Word Match Game Data
const wordMatchData = [
  { word: 'Apple', emoji: '🍎' },
  { word: 'Dog', emoji: '🐕' },
  { word: 'Sun', emoji: '☀️' },
  { word: 'Book', emoji: '📖' },
  { word: 'Star', emoji: '⭐' },
  { word: 'Moon', emoji: '🌙' },
];

// Spell Word Game Data
const spellWordData = [
  { word: 'CAT', hint: '🐱' },
  { word: 'DOG', hint: '🐕' },
  { word: 'SUN', hint: '☀️' },
  { word: 'HAT', hint: '🎩' },
  { word: 'BED', hint: '🛏️' },
];

// Unscramble Game Data
const unscrambleData = [
  { scrambled: 'OGD', answer: 'DOG', hint: '🐕' },
  { scrambled: 'TAC', answer: 'CAT', hint: '🐱' },
  { scrambled: 'NUS', answer: 'SUN', hint: '☀️' },
  { scrambled: 'ERTRE', answer: 'TREE', hint: '🌳' },
  { scrambled: 'OKBO', answer: 'BOOK', hint: '📖' },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Word Match Game Component
function WordMatchGame() {
  const { addXP, updateProgress, progress } = useLearningMode();
  const navigate = useNavigate();
  
  const [pairs, setPairs] = useState(() => shuffleArray(wordMatchData).slice(0, 4));
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const shuffledEmojis = shuffleArray(pairs.map(p => ({ word: p.word, emoji: p.emoji })));

  const handleWordClick = (word: string) => {
    if (matchedPairs.includes(word)) return;
    setSelectedWord(word);
  };

  const handleEmojiClick = (word: string, emoji: string) => {
    if (!selectedWord || matchedPairs.includes(word)) return;
    
    if (selectedWord === word) {
      setMatchedPairs([...matchedPairs, word]);
      setScore(score + 1);
      addXP(5);
      
      if (matchedPairs.length + 1 === pairs.length) {
        setIsComplete(true);
        updateProgress({ gamesPlayed: progress.gamesPlayed + 1 });
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    }
    setSelectedWord(null);
  };

  const resetGame = () => {
    setPairs(shuffleArray(wordMatchData).slice(0, 4));
    setSelectedWord(null);
    setMatchedPairs([]);
    setScore(0);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-xl"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Perfect Match! 🎉</h2>
        <p className="text-muted-foreground mb-6">You matched all the pairs!</p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn-child-friendly bg-secondary text-secondary-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/games')}
            className="btn-child-friendly bg-primary text-primary-foreground flex items-center gap-2"
          >
            More Games
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Match words with pictures!</p>
        <div className="flex items-center gap-1 text-yellow-600">
          <Star className="w-5 h-5 fill-yellow-400" />
          <span className="font-bold">{score}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Words */}
        <div className="space-y-3">
          {pairs.map((pair) => (
            <motion.button
              key={pair.word}
              whileHover={{ scale: matchedPairs.includes(pair.word) ? 1 : 1.02 }}
              whileTap={{ scale: matchedPairs.includes(pair.word) ? 1 : 0.98 }}
              onClick={() => handleWordClick(pair.word)}
              disabled={matchedPairs.includes(pair.word)}
              className={`
                w-full p-4 rounded-2xl font-bold text-lg transition-all
                ${matchedPairs.includes(pair.word)
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : selectedWord === pair.word
                    ? 'bg-primary text-primary-foreground border-2 border-primary shadow-lg'
                    : 'bg-card border-2 border-border hover:border-primary/50'
                }
              `}
            >
              {pair.word}
            </motion.button>
          ))}
        </div>

        {/* Emojis */}
        <div className="space-y-3">
          {shuffledEmojis.map((pair) => (
            <motion.button
              key={pair.word + '-emoji'}
              whileHover={{ scale: matchedPairs.includes(pair.word) ? 1 : 1.02 }}
              whileTap={{ scale: matchedPairs.includes(pair.word) ? 1 : 0.98 }}
              onClick={() => handleEmojiClick(pair.word, pair.emoji)}
              disabled={matchedPairs.includes(pair.word)}
              className={`
                w-full p-4 rounded-2xl text-4xl transition-all
                ${matchedPairs.includes(pair.word)
                  ? 'bg-green-100 border-2 border-green-300'
                  : 'bg-card border-2 border-border hover:border-primary/50'
                }
              `}
            >
              {pair.emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Spell Word Game Component
function SpellWordGame() {
  const { addXP, updateProgress, progress } = useLearningMode();
  const navigate = useNavigate();

  const [currentWord, setCurrentWord] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const word = spellWordData[currentWord];

  const checkAnswer = () => {
    if (userInput.toUpperCase() === word.word) {
      setShowFeedback('correct');
      setScore(score + 1);
      addXP(10);
    } else {
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      if (currentWord < spellWordData.length - 1) {
        setCurrentWord(currentWord + 1);
        setUserInput('');
        setShowFeedback(null);
      } else {
        setIsComplete(true);
        updateProgress({ gamesPlayed: progress.gamesPlayed + 1 });
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    }, 1000);
  };

  const resetGame = () => {
    setCurrentWord(0);
    setUserInput('');
    setScore(0);
    setIsComplete(false);
    setShowFeedback(null);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center shadow-xl"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Super Speller! ✨</h2>
        <p className="text-muted-foreground mb-2">
          You spelled {score} out of {spellWordData.length} words correctly!
        </p>
        <p className="text-green-600 mb-6">+{score * 10} XP earned!</p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn-child-friendly bg-secondary text-secondary-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/games')}
            className="btn-child-friendly bg-primary text-primary-foreground flex items-center gap-2"
          >
            More Games
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Word {currentWord + 1} of {spellWordData.length}
        </p>
        <div className="flex items-center gap-1 text-yellow-600">
          <Star className="w-5 h-5 fill-yellow-400" />
          <span className="font-bold">{score}</span>
        </div>
      </div>

      <div className="text-center">
        <motion.div
          key={word.hint}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl mb-4"
        >
          {word.hint}
        </motion.div>
        <p className="text-lg text-muted-foreground mb-6">Spell what you see!</p>

        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && userInput && checkAnswer()}
          maxLength={word.word.length}
          className={`
            w-full max-w-xs mx-auto text-center text-3xl font-bold tracking-widest p-4 rounded-2xl border-2
            ${showFeedback === 'correct' ? 'bg-green-100 border-green-500 text-green-700' :
              showFeedback === 'wrong' ? 'bg-red-100 border-red-500 text-red-700' :
              'bg-card border-border focus:border-primary'}
          `}
          placeholder={Array(word.word.length).fill('_').join(' ')}
          disabled={showFeedback !== null}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={checkAnswer}
          disabled={!userInput || showFeedback !== null}
          className="mt-6 btn-child-friendly bg-primary text-primary-foreground disabled:opacity-50"
        >
          Check Answer
        </motion.button>
      </div>
    </div>
  );
}

// Unscramble Game Component
function UnscrambleGame() {
  const { addXP, updateProgress, progress } = useLearningMode();
  const navigate = useNavigate();

  const [currentWord, setCurrentWord] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const word = unscrambleData[currentWord];

  const checkAnswer = () => {
    if (userInput.toUpperCase() === word.answer) {
      setShowFeedback('correct');
      setScore(score + 1);
      addXP(15);
    } else {
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      if (currentWord < unscrambleData.length - 1) {
        setCurrentWord(currentWord + 1);
        setUserInput('');
        setShowFeedback(null);
      } else {
        setIsComplete(true);
        updateProgress({ gamesPlayed: progress.gamesPlayed + 1 });
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    }, 1000);
  };

  const resetGame = () => {
    setCurrentWord(0);
    setUserInput('');
    setScore(0);
    setIsComplete(false);
    setShowFeedback(null);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-xl"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Word Wizard! 🧙</h2>
        <p className="text-muted-foreground mb-2">
          You unscrambled {score} out of {unscrambleData.length} words!
        </p>
        <p className="text-green-600 mb-6">+{score * 15} XP earned!</p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn-child-friendly bg-secondary text-secondary-foreground flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/games')}
            className="btn-child-friendly bg-primary text-primary-foreground flex items-center gap-2"
          >
            More Games
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Word {currentWord + 1} of {unscrambleData.length}
        </p>
        <div className="flex items-center gap-1 text-yellow-600">
          <Star className="w-5 h-5 fill-yellow-400" />
          <span className="font-bold">{score}</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg text-muted-foreground mb-4">Unscramble the letters:</p>
        
        <motion.div
          key={word.scrambled}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center gap-2 mb-4"
        >
          {word.scrambled.split('').map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-12 h-12 md:w-16 md:h-16 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        <p className="text-4xl mb-6">{word.hint}</p>

        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && userInput && checkAnswer()}
          maxLength={word.answer.length}
          className={`
            w-full max-w-xs mx-auto text-center text-3xl font-bold tracking-widest p-4 rounded-2xl border-2
            ${showFeedback === 'correct' ? 'bg-green-100 border-green-500 text-green-700' :
              showFeedback === 'wrong' ? 'bg-red-100 border-red-500 text-red-700' :
              'bg-card border-border focus:border-primary'}
          `}
          placeholder="Type your answer"
          disabled={showFeedback !== null}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={checkAnswer}
          disabled={!userInput || showFeedback !== null}
          className="mt-6 btn-child-friendly bg-primary text-primary-foreground disabled:opacity-50"
        >
          Check Answer
        </motion.button>
      </div>
    </div>
  );
}

export function GamePlay() {
  const { gameId } = useParams();

  const getGameComponent = () => {
    switch (gameId) {
      case 'word-match':
        return <WordMatchGame />;
      case 'spell-word':
        return <SpellWordGame />;
      case 'unscramble':
        return <UnscrambleGame />;
      default:
        return <WordMatchGame />;
    }
  };

  const getGameTitle = () => {
    switch (gameId) {
      case 'word-match':
        return { name: 'Word Match', icon: '🎯' };
      case 'spell-word':
        return { name: 'Spell the Word', icon: '✏️' };
      case 'unscramble':
        return { name: 'Unscramble', icon: '🔀' };
      default:
        return { name: 'Game', icon: '🎮' };
    }
  };

  const game = getGameTitle();

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
          <div className="flex items-center gap-3">
            <span className="text-4xl">{game.icon}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{game.name}</h1>
          </div>
        </motion.div>

        <div className="card-neuro p-6">
          {getGameComponent()}
        </div>
      </main>
    </div>
  );
}
