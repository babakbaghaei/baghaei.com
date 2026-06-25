'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import Magnetic from '@/components/effects/Magnetic';
import GlobalUniverse from '@/components/effects/GlobalUniverseLazy';
import { DEFAULT_SCALE, type SolarScale } from '@/components/effects/solarScale';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

export default function Hero({ children }: { children?: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Foreground solar-system scale. Defaults to the locked DEFAULT_SCALE; an
  // override tuned in the admin «منظومه شمسی» panel is saved to localStorage and
  // applied here on the same browser. Lazy init reads it once; it only feeds
  // GlobalUniverse (ssr:false), so there is no hydration mismatch.
  const [solarScale] = useState<SolarScale>(() => {
    if (typeof window === 'undefined') return DEFAULT_SCALE;
    try {
      const raw = window.localStorage.getItem('solar-scale-dev');
      if (raw) return { ...DEFAULT_SCALE, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
    return DEFAULT_SCALE;
  });
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
        {/* Hero panel — the headline + live solar system sit inside one large
            glass card (Cloudflare-style framed hero) that frosts the starfield
            behind it. Calm: no 3D tilt, just the signature glass + border. */}
        <Card
          isHoverable={false}
          roundedClass="rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[3rem]"
          className="mb-8"
          contentClassName="p-6 sm:p-9 lg:p-14"
        >
        <div className="relative">
        {/* Full-bleed live solar system: the Sun blazes from the card's
            top-leading corner — clipped by the card's OWN rounded edge, so it
            reads as light entering the frame, never a disc floating mid-panel
            sliced by a straight container edge. Planets revolve across the whole
            card behind the copy. Negative inset cancels the Card's padding so it
            reaches the true card corners. */}
        <div className="pointer-events-none absolute -inset-6 sm:-inset-9 lg:-inset-14 overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[3rem]">
          <GlobalUniverse scale={solarScale} />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12 min-h-[320px] sm:min-h-[420px] lg:min-h-[540px]">
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

          {/* In RTL this trailing column is the LEFT side, where the corner Sun
              sits. pointer-events-none so the planets behind it stay clickable. */}
          <div className="order-2 hidden lg:block pointer-events-none" aria-hidden />
        </div>
        </div>
        </Card>

        <div className="w-full h-px bg-border my-8" />
        {children}
      </div>
    </section>
  );
}