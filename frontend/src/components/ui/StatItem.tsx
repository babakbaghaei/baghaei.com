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
 
 const isTenPlus = useTransform(
 isMotionValue ? (value as MotionValue<string>) : fallbackValue, 
 (v) => (v === '10+' || v === '۱۰+') ? 1 : 0
 );
 
 const targetScale = useTransform(isTenPlus, [0, 1], [1, 1.15]);
 const scale = useSpring(targetScale, { stiffness: 300, damping: 15 });
 const fontWeight = useTransform(isTenPlus, [0, 1], [700, 900]);

 return (
 <div 
  className={`space-y-2 md:space-y-3 p-6 bg-secondary border border-border rounded-2xl hover:bg-secondary/80 transition-all cursor-default group text-right ${className}`}
 >
  <motion.div 
  style={{ fontWeight, scale, originX: 1 }}
  className="text-3xl md:text-4xl font-display text-foreground dark:text-foreground tabular-nums tracking-tight group-hover:text-primary transition-colors"
  >
  {isMotionValue ? (
   <motion.span>{value}</motion.span>
  ) : (
   /[^\d\.\%\+\s]/.test(value.replace(/[۰-۹]/g, '0')) ? value : <Counter value={value} />
  )}
  </motion.div>
  <div className="text-[10px] text-foreground/60 font-black uppercase tracking-wider group-hover:text-foreground transition-colors">
  {label}
  </div>
 </div>
 );
};