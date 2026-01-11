import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BackButtonProps {
  showHome?: boolean;
  label?: string;
}

export function BackButton({ showHome = true, label = 'Back' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 mb-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm hover:shadow-md transition-all text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">{label}</span>
      </motion.button>

      {showHome && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span className="font-medium">Home</span>
        </motion.button>
      )}
    </div>
  );
}
