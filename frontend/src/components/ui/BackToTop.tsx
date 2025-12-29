'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-8 left-8 z-[100]"
        >
          <button
            onClick={scrollToTop}
            className="relative p-4 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all group"
          >
            {/* Circular Progress Path */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <motion.circle
                cx="50%"
                cy="50%"
                r="22"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-primary"
                style={{
                  pathLength: scrollYProgress,
                  opacity: 0.3
                }}
              />
            </svg>
            <ArrowUp className="w-5 h-5 relative z-10 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
