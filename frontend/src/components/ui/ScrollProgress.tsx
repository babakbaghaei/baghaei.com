'use client';

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex items-center gap-4">
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Scroll</span>
            <span className="text-xs font-mono text-white">PROGRESS</span>
        </div>
        <div className="relative h-20 w-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div 
                className="absolute top-0 left-0 w-full bg-primary origin-top"
                style={{ scaleY: scrollYProgress, height: '100%' }}
            />
        </div>
    </div>
  );
}
