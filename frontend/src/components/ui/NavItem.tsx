'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NavItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  isActive,
  onClick,
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative py-2 hover:text-white transition-colors font-display ${isActive ? 'text-white' : 'text-zinc-400'} ${className}`}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="nav-dot"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
        />
      )}
    </button>
  );
};
