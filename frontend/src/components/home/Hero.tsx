'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import Magnetic from '@/components/effects/Magnetic';
import GlobalUniverse from '@/components/effects/GlobalUniverseLazy';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

export default function Hero({ children }: { children?: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayTextLine1, setDisplayTextLine1] = useState('');
  const [displayTextLine2, setDisplayTextLine2] = useState('');
  const [phase, setTypingPhase] = useState<'line1' | 'line2'>('line1');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Reduced-motion: skip the JS typing loop entirely and render the complete
  // headline at rest (derived below). The global MotionConfig only neutralizes
  // declarative Framer transforms, not this setTimeout-driven effect.
  const shownLine1 = prefersReducedMotion ? line1Text : displayTextLine1;
  const shownLine2 = prefersReducedMotion ? words[0] : displayTextLine2;

  useEffect(() => {
    if (prefersReducedMotion) return;
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
  }, [displayTextLine1, displayTextLine2, isDeleting, phase, wordIndex, words, getDelay, prefersReducedMotion]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden pt-32 pb-20 lg:pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full flex flex-col relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 mb-8">
          <motion.div
            className="order-1 space-y-6 flex flex-col items-start text-right"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-1.5 bg-secondary/50 border border-border rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/30 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-muted-foreground text-xs uppercase tracking-wider font-display" style={{ fontWeight: 500 }}>
                پیشرو در معماری سیستم‌های سازمانی
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-[7vw] sm:text-6xl md:text-8xl lg:text-9xl font-display tracking-tight leading-[1.1] w-full">
              {/* Stable, complete headline for screen readers. The animated typing
                  below only ever exposes mutating partial text, so it is hidden
                  from assistive tech via aria-hidden. */}
              <span className="sr-only">{`${line1Text} ${words[0]}`}</span>
              <div aria-hidden="true" className="w-full flex flex-col items-start text-right gap-2">
                <div className="h-[52px] sm:h-[70px] md:h-[110px] lg:h-[150px] flex items-center justify-start whitespace-nowrap overflow-visible">
                  <span className="text-muted-foreground font-bold">{shownLine1}</span>
                  {!prefersReducedMotion && phase === 'line1' && (
                    <motion.div
                      animate={{ opacity: [0.4, 0.4, 0, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                      className="w-[3px] md:w-[4px] h-[0.8em] bg-foreground mr-1.5"
                    />
                  )}
                </div>
                <div className="h-[52px] sm:h-[70px] md:h-[110px] lg:h-[150px] flex items-center justify-start whitespace-nowrap overflow-visible">
                  <span className="text-foreground font-black">
                    {shownLine2.endsWith('.') ? (
                      <>{shownLine2.slice(0, -1)}<span className="text-muted-foreground font-bold">.</span></>
                    ) : (
                      shownLine2
                    )}
                  </span>
                  {!prefersReducedMotion && phase === 'line2' && (
                    <motion.div
                      animate={{ opacity: [0.4, 0.4, 0, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                      className="w-[3px] md:w-[4px] h-[0.8em] bg-foreground mr-1.5"
                    />
                  )}
                </div>
              </div>
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-2xl text-xl md:text-2xl text-muted-foreground font-sans leading-relaxed text-right">
              گروه فناوری بقایی؛ طراحی و توسعه نرم‌افزارهای مقیاس‌پذیر و زیرساخت‌های مهندسی شده برای کسب‌وکارهای مدرن.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-start gap-4 pt-2">
              <Magnetic>
                <Button className="rounded-full px-8 py-4 text-base" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  شروع همکاری
                </Button>
              </Magnetic>
              <Magnetic>
                <Button variant="ghost" className="rounded-full px-8 py-4 text-base" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                  مشاهده پروژه‌ها
                </Button>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* Experiment (item 6): frame the solar-system hero inside a glass
              card — the "framed visual" trend (à la Cloudflare). overflow-hidden
              contains the orbit sprawl into a neat telescope-like view. Fully
              reversible — it's just this wrapper around the existing universe. */}
          <div className="order-2 h-[320px] sm:h-[400px] lg:h-[520px] w-full relative">
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/20 backdrop-blur-[2px] shadow-2xl">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[2rem]"
                style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06), transparent 60%)' }}
              />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />
              <GlobalUniverse />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-border my-8" />
        {children}
      </div>
    </section>
  );
}