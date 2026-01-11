import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
  bgColor: string;
  delay?: number;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  to,
  color,
  bgColor,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link to={to}>
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className={`card-neuro p-6 cursor-pointer group ${bgColor} border-2 border-transparent hover:border-primary/20`}
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          
          <div className="mt-4 flex items-center text-primary font-medium text-sm">
            <span>Start learning</span>
            <motion.span
              className="ml-2"
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
