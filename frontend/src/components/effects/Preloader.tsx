'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/layout/Logo';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for actual load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
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
          <div className="flex flex-col items-center gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center !text-black p-6"
            >
              <Logo className="w-full h-full text-black" />
            </motion.div>
            
            <div className="overflow-hidden h-4 w-48 bg-zinc-900 rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] as any }}
                className="h-full bg-white w-full rounded-full"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] font-display"
            >
              Baghaei Tech Group
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
