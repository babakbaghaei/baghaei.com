'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface ErrorLayoutProps {
 code: string;
 title: string;
 description: string;
}

export default function ErrorLayout({ code, title, description }: ErrorLayoutProps) {
 return (
  <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
   {/* Background Grid */}
   <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
   
   <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-2xl">
    <motion.div 
     initial={{ opacity: 0, scale: 0.8 }}
     animate={{ opacity: 1, scale: 1 }}
     transition={{ duration: 0.8, ease: "easeOut" }}
    >
     <Logo className="w-20 h-20" />
    </motion.div>

    <div className="space-y-4">
     <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-8xl md:text-9xl font-black font-display tracking-tighter opacity-10"
     >
      {code}
     </motion.h1>
     <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-3xl md:text-5xl font-bold font-display leading-tight"
     >
      {title}
     </motion.h2>
     <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-zinc-500 text-lg md:text-xl font-sans"
     >
      {description}
     </motion.p>
    </div>

    <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: 0.3 }}
    >
     <Link 
      href="/" 
      className="btn-primary"
     >
      بازگشت به خانه
     </Link>
    </motion.div>
   </div>

   {/* Decorative Fibonacci Spiral-like lines */}
   <div className="absolute bottom-0 left-0 w-full h-full opacity-[0.05] pointer-events-none select-none z-0">
    <svg viewBox="0 0 1000 1000" className="w-full h-full text-white fill-none stroke-current stroke-[0.5]">
     <circle cx="500" cy="500" r="300" strokeDasharray="10 10" />
     <circle cx="500" cy="500" r="450" opacity="0.5" />
    </svg>
   </div>
  </main>
 );
}
