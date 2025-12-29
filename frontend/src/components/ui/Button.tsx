'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useSound } from '@/lib/utils/sounds';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
 children?: React.ReactNode;
 variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
 size?: 'default' | 'sm' | 'lg' | 'icon';
 isLoading?: boolean;
 leftIcon?: React.ReactNode;
 rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
 children,
 variant = 'primary',
 size = 'default',
 isLoading,
 leftIcon,
 rightIcon,
 className = "",
 ...props
}) => {
 const { play } = useSound();
 const baseStyles = "relative flex items-center justify-center gap-3 rounded-full font-display transition-all duration-300 active:scale-95 disabled:opacity-70 overflow-hidden group";
 
 const sizeStyles = {
  default: "px-8 py-3 text-sm",
  sm: "px-4 py-2 text-xs",
  lg: "px-10 py-4 text-base",
  icon: "w-10 h-10 p-0"
 };

 const variants = {
  primary: "bg-primary text-primary-foreground hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
  secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
  outline: "bg-transparent text-foreground border border-border hover:border-foreground",
  ghost: "bg-transparent text-muted-foreground hover:text-foreground"
 };

 return (
  <motion.button
   whileHover={{ y: -2 }}
   whileTap={{ y: 0 }}
   onHoverStart={() => play('hover')}
   onClick={(e) => {
    play('click');
    if (props.onClick) props.onClick(e as any);
   }}
   className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
   style={{ fontWeight: 400, ...props.style }}
   disabled={isLoading || props.disabled}
   {...(props as any)}
  >
   {/* Background Hover Effect */}
   {variant === 'primary' && (
    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
   )}
   
   <span className="relative z-10 flex items-center gap-2">
    {isLoading ? (
     <Loader2 className="w-4 h-4 animate-spin text-current" />
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