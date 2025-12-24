'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const baseStyles = "relative flex items-center justify-center gap-3 px-8 py-3 rounded-full font-black font-display text-sm transition-all duration-300 active:scale-95 disabled:opacity-70 overflow-hidden group";

  const variants = {
    primary: "bg-white !text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    secondary: "bg-zinc-900 text-white border border-white/10 hover:bg-zinc-800",
    outline: "bg-transparent text-white border border-white/20 hover:border-white",
    ghost: "bg-transparent text-zinc-400 hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Background Hover Effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </span>
    </motion.button>
  );
};
