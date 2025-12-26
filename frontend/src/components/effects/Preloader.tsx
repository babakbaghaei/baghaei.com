'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/layout/Logo';
import { toPersianDigits } from '@/lib/utils/format';

const loadingSteps = [
 "در حال بارگذاری زیرساخت...",
 "بررسی امنیت لایه‌ها...",
 "بهینه‌سازی معماری...",
 "آماده‌سازی رابط کاربری...",
];

export default function Preloader() {
 const [isLoading, setIsLoading] = useState(true);
 const [progress, setProgress] = useState(0);
 const [statusIndex, setStatusIndex] = useState(0);

 useEffect(() => {
  const interval = setInterval(() => {
   setProgress((prev) => {
    if (prev >= 100) {
     clearInterval(interval);
     setTimeout(() => setIsLoading(false), 500);
     return 100;
    }
    
    // Organic stepped increments
    const jump = Math.random() > 0.7 ? Math.random() * 15 + 5 : Math.random() * 5;
    const next = Math.min(prev + jump, 100);
    
    // Update status text based on progress
    if (next > 75) setStatusIndex(3);
    else if (next > 50) setStatusIndex(2);
    else if (next > 25) setStatusIndex(1);
    
    return next;
   });
  }, 150);

  return () => clearInterval(interval);
 }, []);

 return (
  <AnimatePresence>
   {isLoading && (
    <motion.div
     initial={{ y: 0 }}
     exit={{ y: "-100%" }}
     transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] as any, delay: 0.2 }}
     className="fixed inset-0 z-[1000] bg-black flex items-center justify-center pointer-events-none"
    >
     <div className="flex flex-col items-center gap-10">
      <motion.div 
       initial={{ opacity: 0, scale: 0.8 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.8, ease: "easeOut" }}
       className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center !text-black p-6 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
      >
       <Logo className="w-full h-full text-black" />
      </motion.div>
      
      <div className="flex flex-col items-center gap-4">
       <div className="overflow-hidden h-1.5 w-64 bg-white/5 rounded-full relative">
        <motion.div
         animate={{ width: `${progress}%` }}
         transition={{ type: "spring", damping: 20, stiffness: 100 }}
         className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        />
       </div>
       
       <div className="flex justify-between w-64 px-1">
        <motion.span 
         key={statusIndex}
         initial={{ opacity: 0, y: 5 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-[9px] font-bold text-zinc-500 font-display"
        >
         {loadingSteps[statusIndex]}
        </motion.span>
        <span className="text-[9px] font-black text-white font-display tracking-tighter">
         {toPersianDigits(Math.floor(progress))}%
        </span>
       </div>
      </div>

      <motion.p
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ delay: 0.5 }}
       className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.8em] font-display mt-4"
      >
       Baghaei Tech Group
      </motion.p>
     </div>
    </motion.div>
   )}
  </AnimatePresence>
 );
}