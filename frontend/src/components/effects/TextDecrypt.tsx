'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

interface TextDecryptProps {
 text: string;
 speed?: number;
 delay?: number;
 trigger?: boolean;
 className?: string;
}

const chars = '-/_*+!<>@#$%&?0123456789';

export default function TextDecrypt({ text, speed = 40, delay = 0, trigger = false, className = "" }: TextDecryptProps) {
 const prefersReducedMotion = usePrefersReducedMotion();
 const [displayText, setDisplayText] = useState(() =>
  trigger ? '' : text.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
 );

 const decrypt = useCallback(() => {
  let iteration = 0;
  
  const interval = setInterval(() => {
   setDisplayText(
    text
     .split('')
     .map((letter, index) => {
      if (index < iteration) {
       return text[index];
      }
      return chars[Math.floor(Math.random() * chars.length)];
     })
     .join('')
   );

   if (iteration >= text.length) {
    clearInterval(interval);
   }

   iteration += 1 / 3;
  }, speed);
  
  return () => clearInterval(interval);
 }, [text, speed]);

 useEffect(() => {
  // Reduced motion: skip the scramble; the real text is rendered directly below.
  if (prefersReducedMotion) return;
  if (trigger) {
   const timer = setTimeout(() => {
    decrypt();
   }, delay);
   return () => clearTimeout(timer);
  }
 }, [trigger, text, delay, decrypt, prefersReducedMotion]);

 return (
  <span className={className}>
   {prefersReducedMotion ? text : displayText}
  </span>
 );
}
