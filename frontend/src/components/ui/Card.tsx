'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  glowColor = "rgba(255,255,255,0.1)",
  isHoverable = true
}) => {
  return (
    <motion.div
      whileHover={isHoverable ? { y: -5 } : {}}
      className={`relative bg-zinc-950/50 backdrop-blur-sm border border-white/10 rounded-[3rem] p-10 transition-all duration-500 hover:border-white/20 ${className}`}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[3rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div
          className="absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 blur-[80px]"
          style={{ background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 80%)` }}
        />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
