'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface TextDecryptProps {
 text: string;
 speed?: number;
 delay?: number;
 trigger?: boolean;
 className?: string;
}

const chars = '-/_*+!<>@#$%&?0123456789';

export default function TextDecrypt({ text, speed = 40, delay = 0, trigger = false, className = "" }: TextDecryptProps) {
 const [displayText, setDisplayText] = useState('');

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
  if (trigger) {
   const timer = setTimeout(() => {
    decrypt();
   }, delay);
   return () => clearTimeout(timer);
  } else {
   // Initial encrypted state
   const encrypted = text.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
   setDisplayText(encrypted);
  }
 }, [trigger, text, delay, decrypt]);

 return (
  <span className={className}>
   {displayText}
  </span>
 );
}
