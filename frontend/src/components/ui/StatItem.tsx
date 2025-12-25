'use client';

import React from 'react';
import { Counter } from '@/components/effects/Counter';
import { motion, MotionValue, useTransform, useSpring, useMotionValue } from 'framer-motion';

interface StatItemProps {
  label: string;
  value: string | MotionValue<string>;
  className?: string;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, className = "" }) => {
  const isMotionValue = typeof value !== 'string';
  const fallbackValue = useMotionValue('');
  
  // Create a transform that checks for the "10+" milestone
  const isTenPlus = useTransform(
    isMotionValue ? (value as MotionValue<string>) : fallbackValue, 
    (v) => (v === '10+' || v === '۱۰+') ? 1 : 0
  );
  
  // Static check for initial render or non-motion values
  const initialIsTenPlus = !isMotionValue && (value === '10+' || value === '۱۰+');

  // Animated properties
  // The transform will handle the mapping from 0/1 to the desired scale
  const targetScale = useTransform(isTenPlus, [0, 1], [1, 1.15]);
  const scale = useSpring(targetScale, { stiffness: 300, damping: 15 });
  
  const fontWeight = useTransform(isTenPlus, [0, 1], [700, 900]);

  return (
    <div 
      className={`space-y-2 md:space-y-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-default group text-right ${className}`}
    >
      <motion.div 
        style={{ fontWeight, scale, originX: 1 }}
        className="text-3xl md:text-4xl font-display text-white tabular-nums tracking-tight group-hover:text-green-400 transition-colors"
      >
        {isMotionValue ? (
          <motion.span>{value}</motion.span>
        ) : (
          /[^\d\.\%\+\s]/.test(value.replace(/[۰-۹]/g, '0')) ? value : <Counter value={value} />
        )}
      </motion.div>
      <div className="text-[10px] text-zinc-500 font-bold uppercase font-display tracking-wider group-hover:text-zinc-400 transition-colors">
        {label}
      </div>
    </div>
  );
};
