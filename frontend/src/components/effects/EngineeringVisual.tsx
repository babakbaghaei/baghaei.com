'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function EngineeringVisual() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none select-none">
      {/* Background Glow */}
      <div className="absolute w-64 h-64 bg-zinc-500/10 rounded-full blur-[100px]" />
      
      {/* Layers of Architecture */}
      <div className="relative flex flex-col gap-8 items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, rotateX: 45, y: 50 * i }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              y: [50 * i, 50 * i - 10, 50 * i],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4, 
              delay: i * 0.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-64 h-32 md:w-80 md:h-40 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm relative overflow-hidden"
            style={{ transform: "rotateX(60deg) rotateZ(-10deg)" }}
          >
            {/* Grid Pattern inside layer */}
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.1]" />
            
            {/* Pulsing Nodes */}
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i }}
              className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"
            />
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i + 1 }}
              className="absolute bottom-4 right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"
            />

            {/* Moving Data Line */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i }}
              className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </motion.div>
        ))}

        {/* Vertical Connecting Lines */}
        <div className="absolute inset-0 flex justify-center gap-20 py-10 opacity-20">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="w-px h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>
      </div>

      {/* Decorative Text/Tags */}
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.span 
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/4 left-10 text-[10px] font-mono text-zinc-500 uppercase tracking-widest"
        >
          Logic_Core
        </motion.span>
        <motion.span 
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-10 text-[10px] font-mono text-zinc-500 uppercase tracking-widest"
        >
          Security_Mesh
        </motion.span>
      </div>
    </div>
  );
}
