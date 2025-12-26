'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Counter } from '@/components/effects/Counter';
import { Compass, ArrowDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatItem } from '../ui/StatItem';
import Magnetic from '@/components/effects/Magnetic';

export default function Hero() {
 const [displayTextLine1, setDisplayTextLine1] = useState('');
 const [displayTextLine2, setDisplayTextLine2] = useState('');
 const [phase, setTypingPhase] = useState<'line1' | 'line2'>('line1');
 const [wordIndex, setWordIndex] = useState(0);
 const [isDeleting, setIsDeleting] = useState(false);

 const { scrollY } = useScroll();
 const contentY = useTransform(scrollY, [0, 500], [0, 200]);

 // Compass Mouse Tracking
 const mouseX = useMotionValue(0);
 const mouseY = useMotionValue(0);
 const compassRotate = useSpring(0, { stiffness: 100, damping: 30 });

 useEffect(() => {
 const handleMouseMove = (e: MouseEvent) => {
  // Calculate angle relative to compass center (now on the left)
  const x = e.clientX - 0; 
  const y = e.clientY - 0; 
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  compassRotate.set(angle + 45); 
 };
 window.addEventListener('mousemove', handleMouseMove);
 return () => window.removeEventListener('mousemove', handleMouseMove);
 }, [compassRotate]);

 const line1Text = "خلق سیستم‌های";
 const words = useMemo(() => [
 "تحت وب، اندروید و iOS.", "ماندگار.", "هوشمند.", "مقیاس‌پذیر.", "مهندسی‌شده.", "امن و پایدار.",
 "فناورانه.", "مینیمال.", "توزیع‌شده.", "پیشرفته.", "مقیاس‌جهانی.",
 "امنیت‌پایه.", "بهینه‌شده.", "منحصربه‌فرد.", "آینده‌نگر."
 ], []);

 const getDelay = useCallback(() => {
 if (isDeleting) return 30 + Math.random() * 20;
 const isStartOfWord = phase === 'line2' && displayTextLine2.length === 0;
 if (isStartOfWord) return 1000;
 return 70 + Math.random() * 100;
 }, [isDeleting, phase, displayTextLine2.length]);

 useEffect(() => {
 let timer: NodeJS.Timeout;

 const handleTyping = () => {
  if (phase === 'line1') {
  if (displayTextLine1.length < line1Text.length) {
   setDisplayTextLine1(line1Text.slice(0, displayTextLine1.length + 1));
   timer = setTimeout(handleTyping, getDelay());
  } else {
   timer = setTimeout(() => setTypingPhase('line2'), 1000);
  }
  } else {
  const currentFullWord = words[wordIndex];
  
  if (!isDeleting) {
   if (displayTextLine2.length < currentFullWord.length) {
   setDisplayTextLine2(currentFullWord.slice(0, displayTextLine2.length + 1));
   timer = setTimeout(handleTyping, getDelay());
   } else {
   timer = setTimeout(() => setIsDeleting(true), 3500);
   }
  } else {
   if (displayTextLine2.length > 0) {
   setDisplayTextLine2(currentFullWord.slice(0, displayTextLine2.length - 1));
   timer = setTimeout(handleTyping, getDelay());
   } else {
   setIsDeleting(false);
   setWordIndex((prev) => (prev + 1) % words.length);
   timer = setTimeout(handleTyping, 500);
   }
  }
  }
 };

 timer = setTimeout(handleTyping, 100);
 return () => clearTimeout(timer);
 }, [displayTextLine1, displayTextLine2, isDeleting, phase, wordIndex, words, getDelay]);

 const itemVariants = {
 hidden: { opacity: 0, y: 20 },
 visible: { 
  opacity: 1, y: 0,
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
 }
 };

 return (
 <section id="hero" className="relative min-h-screen flex flex-col items-start justify-center pt-32 bg-transparent">
  <motion.div 
  style={{ 
   rotate: compassRotate
  }}
  className="absolute top-0 left-0 -ml-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden origin-center"
  >
  <Compass className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-foreground" strokeWidth={0.5} />
  </motion.div>

  <motion.div 
  variants={itemVariants} 
  initial="hidden" 
  animate="visible" 
  className="max-w-7xl mx-auto px-6 lg:px-16 text-right relative z-10 w-full"
  >
  <div className="space-y-12 flex flex-col items-start">
   <motion.div variants={itemVariants} initial="hidden" animate="visible" className="inline-flex items-center gap-3 px-4 py-1.5 bg-secondary/50 border border-border rounded-full">
   <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
   </span>
   <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-display" style={{ fontWeight: 500 }}>
    پیشرو در معماری سیستم‌های سازمانی
   </span>
   </motion.div>
   
   <motion.h1 
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   className="text-5xl md:text-8xl lg:text-9xl font-display tracking-tight leading-[1] w-full"
   >
   <div className="w-full flex flex-col items-start text-right gap-4">
    <div className="h-[60px] md:h-[100px] lg:h-[140px] flex items-center justify-start whitespace-nowrap overflow-visible">
    <span className="text-muted-foreground font-bold" key={`l1-${displayTextLine1.length}`}>{displayTextLine1}</span>
    {phase === 'line1' && (
     <motion.div 
     animate={{ opacity: [0.4, 0.4, 0, 0] }}
     transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
     className="w-[2px] md:w-[3px] h-[0.8em] bg-foreground mr-1.5"
     />
    )}
    </div>

    <div className="h-[60px] md:h-[100px] lg:h-[140px] flex items-center justify-start whitespace-nowrap overflow-visible">
    <span className="text-foreground font-black" key={`l2-${displayTextLine2}`}>
     {displayTextLine2.endsWith('.') ? (
     <>
      {displayTextLine2.slice(0, -1)}
      <span className="text-muted-foreground font-bold">.</span>
     </>
     ) : (
     displayTextLine2
     )}
    </span>
    {phase === 'line2' && (
     <motion.div 
     animate={{ opacity: [0.4, 0.4, 0, 0] }}
     transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
     className="w-[2px] md:w-[3px] h-[0.8em] bg-foreground mr-1.5"
     />
    )}
    </div>
   </div>
   </motion.h1>

   <motion.p variants={itemVariants} initial="hidden" animate="visible" className="max-w-2xl text-lg md:text-xl text-muted-foreground font-sans leading-relaxed text-right">
   گروه فناوری بقایی؛ طراحی و توسعه نرم‌افزارهای مقیاس‌پذیر و زیرساخت‌های مهندسی شده برای کسب‌وکارهای مدرن.
   </motion.p>

   <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex flex-wrap justify-start gap-6 pt-4">
   <Button 
    style={{ fontWeight: 500 }}
    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
   >
    شروع همکاری
   </Button>
   
   <Button 
    variant="ghost"
    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
   >
    مشاهده پروژه‌ها
   </Button>
   </motion.div>
  </div>
  </motion.div>

  <motion.div 
  animate={{ y: [0, 10, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
  className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground/30 pointer-events-none"
  >
  <ArrowDown className="w-6 h-6" />
  </motion.div>
 </section>
 );
}
