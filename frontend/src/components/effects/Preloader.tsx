'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ["مهندسی", "دقت", "امنیت", "مقیاس‌پذیری", "خلاقیت", "گروه فناوری بقایی"];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [dimension, setInitialDimension] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Run this only on mount to avoid cascading renders
    const updateDimension = () => {
      setInitialDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateDimension();
    
    const timeout = setTimeout(() => {
      if (index === words.length - 1) {
        setIsLoading(false);
      } else {
        setIndex(index + 1);
      }
    }, index === 0 ? 1000 : 150);

    return () => clearTimeout(timeout);
  }, [index]);

  const opacity = {
    initial: { opacity: 0 },
    enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
  };

  const slideUp = {
    initial: { top: 0 },
    exit: { 
        top: "-100vh", 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any, delay: 0.2 } 
    }
  };

  return (
    <AnimatePresence mode='wait'>
      {isLoading && (
        <motion.div 
          variants={slideUp} 
          initial="initial" 
          exit="exit" 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-zinc-950 text-white"
        >
          {dimension.width > 0 && (
            <>
              <motion.p 
                variants={opacity} 
                initial="initial" 
                animate="enter"
                className="flex items-center absolute z-10 text-4xl md:text-6xl font-black font-display tracking-tighter"
              >
                {words[index]}
                <span className="block w-3 h-3 bg-white rounded-full mr-4 animate-pulse" />
              </motion.p>
              <svg className="absolute top-0 w-full h-[calc(100%+300px)] fill-zinc-950">
                <path d={`M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`} />
              </svg>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}