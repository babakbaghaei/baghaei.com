'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useInView, useScroll, MotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { toPersianDigits } from '@/lib/utils/format';
import { useSound } from '@/lib/utils/sounds';

/**
 * Planet Data with Mass and Position
 */
const PLANETS_DATA = [
  { id: 'mercury', name: 'عطارد', color: '#A5A5A5', radius: 0.034, au: 0.38, longitude: 148.8, period: 88, mass: 0.00017, texture: 'radial-gradient(circle at 30% 30%, #A5A5A5, #4A4A4A)' },
  { id: 'venus', name: 'زهره', color: '#E3BB76', radius: 0.084, au: 0.72, longitude: 239.1, period: 224.7, mass: 0.0025, isRetrograde: true, texture: 'linear-gradient(45deg, #E3BB76, #A67C37)' },
  { id: 'earth', name: 'زمین', color: '#2271B3', radius: 0.089, au: 1.00, longitude: 93.8, period: 365.2, mass: 0.0031, hasMoon: true, texture: 'radial-gradient(circle at 30% 30%, #4B9CD3, #1E40AF)' },
  { id: 'mars', name: 'مریخ', color: '#E27B58', radius: 0.048, au: 1.52, longitude: 242.8, period: 687, mass: 0.0003, texture: 'radial-gradient(circle at 60% 40%, #E27B58, #7C2D12)' },
  { id: 'jupiter', name: 'مشتری', color: '#D39C7E', radius: 1.000, au: 5.20, longitude: 107.3, period: 4331, mass: 1.0, texture: 'linear-gradient(to bottom, #D39C7E 0%, #AF8069 20%, #D39C7E 40%, #AF8069 60%, #D39C7E 80%)' },
  { id: 'saturn', name: 'زحل', color: '#C5AB6E', radius: 0.843, au: 9.54, longitude: 1.1, period: 10747, mass: 0.299, hasRing: true, texture: 'linear-gradient(to bottom, #C5AB6E 0%, #8E7A42 25%, #C5AB6E 50%, #8E7A42 75%, #C5AB6E 100%)' },
  { id: 'uranus', name: 'اورانوس', color: '#B5E3E3', radius: 0.358, au: 19.2, longitude: 59.7, period: 30589, mass: 0.045, isRetrograde: true, texture: 'radial-gradient(circle at 50% 50%, #B5E3E3, #5DA5A5)' },
  { id: 'neptune', name: 'نپتون', color: '#6081FF', radius: 0.346, au: 30.1, longitude: 1.2, period: 59800, mass: 0.053, texture: 'radial-gradient(circle at 50% 50%, #6081FF, #1E3A8A)' },
];

const MY_MASS = 0.05;

const PlanetBody = ({ planet, mX, mY }: { planet: any, mX: MotionValue<number>, mY: MotionValue<number> }) => {
  const pSize = planet.radius * 35 + 4;
  
  return (
    <motion.div 
      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ 
        width: pSize, 
        height: pSize, 
        zIndex: 20,
        x: mX,
        y: mY
      }}
    >
      <div className="w-full h-full rounded-full relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0" style={{ background: planet.texture }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.4)_0% ,transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]" />
      </div>

      {planet.hasRing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280%] h-[25%] border-[2px] border-white/20 rounded-full rotate-[25deg] shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
      )}
      
      {planet.hasMoon && (
        <div className="absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 border border-dashed border-white/5 rounded-full pointer-events-none" />
          <div className="absolute inset-0" style={{ transform: `rotate(62.6deg)` }}>
            <div 
              className="absolute top-0 left-1/2 bg-zinc-400 rounded-full -translate-x-1/2 shadow-[0_0_5px_rgba(255,255,255,0.2)]" 
              style={{ width: pSize * 0.27, height: pSize * 0.27 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const Planet = ({ planet, mouseX, mouseY, index }: { planet: any, mouseX: MotionValue<number>, mouseY: MotionValue<number>, index: number }) => {
  const pDist = 50 + Math.sqrt(planet.au) * 85;
  
  // Resistance based on mass
  const pushIntensity = Math.min(25, 1 / (planet.mass * 50 + 0.01));
  const mX = useSpring(useTransform(mouseX, [-500, 500], [-pushIntensity, pushIntensity]), { stiffness: 100, damping: 30 });
  const mY = useSpring(useTransform(mouseY, [-500, 500], [-pushIntensity, pushIntensity]), { stiffness: 100, damping: 30 });

  const visualAngle = 90 - planet.longitude;
  const ringDuration = 30 + Math.sqrt(planet.period) * 0.8;
  const rotationDir = planet.isRetrograde ? 360 : -360;

  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        width: pDist * 2,
        height: pDist * 2,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div 
        className="absolute inset-0 border border-dashed border-white/10 rounded-full"
        style={{ borderWidth: '1.2px' }}
        animate={{ rotate: rotationDir }}
        transition={{ duration: ringDuration, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0" style={{ transform: `rotate(${visualAngle}deg)` }}>
        <PlanetBody planet={planet} mX={mX} mY={mY} />
      </div>
    </div>
  );
};

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const { play } = useSound();
  const isInView = useInView(containerRef as any, { margin: "-100px" });
  
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const mouseXRel = useMotionValue(0);
  const mouseYRel = useMotionValue(0);

  // Magnet for the Sun
  const sunX = useSpring(useTransform(mouseXRel, [-500, 500], [-8, 8]), { stiffness: 120, damping: 30 });
  const sunY = useSpring(useTransform(mouseYRel, [-500, 500], [-8, 8]), { stiffness: 120, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    mouseXRel.set(curX - centerX);
    mouseYRel.set(curY - centerY);

    // Gravity logic
    let totalPullX = 0;
    let totalPullY = 0;

    PLANETS_DATA.forEach((p) => {
      const pDist = 50 + Math.sqrt(p.au) * 85;
      const angleRad = ((90 - p.longitude) * Math.PI) / 180;
      const pX = centerX + Math.cos(angleRad) * pDist;
      const pY = centerY - Math.sin(angleRad) * pDist;
      
      const dx = pX - curX;
      const dy = pY - curY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Stable Gravity Pull Logic:
      // Pull strength based on planet mass, with a smooth quadratic falloff
      const maxDist = 300;
      if (p.mass > MY_MASS && dist < maxDist && dist > 5) {
        const strength = Math.min(100, p.mass * 120); // Max 100px pull
        const falloff = Math.pow(1 - dist / maxDist, 2);
        totalPullX += (dx / dist) * strength * falloff;
        totalPullY += (dy / dist) * strength * falloff;
      }
    });

    window.dispatchEvent(new CustomEvent('cursor-gravity', { 
      detail: { x: totalPullX, y: totalPullY } 
    }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseXRel.set(0);
    mouseYRel.set(0);
    window.dispatchEvent(new CustomEvent('cursor-gravity', { detail: { x: 0, y: 0 } }));
  }, []);

  useEffect(() => {
    if (!isInView) {
      handleMouseLeave();
    }
  }, [isInView, handleMouseLeave]);

  return (
    <Section sectionRef={sectionRef} id="philosophy" className="!py-0 min-h-screen border-y border-zinc-900 bg-black font-mono select-none overflow-hidden" containerClassName="h-full min-h-screen flex items-center justify-center py-20">
      {/* High-level Mouse Catcher */}
      <div 
        ref={containerRef as any} 
        onMouseMove={handleMouseMove} 
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => play('hover')} 
        className="absolute inset-0 z-[50]" 
      />

      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none opacity-[0.07]">
        <svg viewBox="0 0 1000 618" preserveAspectRatio="xMidYMid slice" className="w-full h-full text-zinc-100 fill-none stroke-current stroke-[0.5]">
          <rect x="0" y="0" width="618" height="618" /><rect x="618" y="0" width="382" height="382" /><rect x="618" y="382" width="236" height="236" />
          <path d="M 618,618 A 618,618 0 0 1 0,0 M 618,618 A 382,382 0 0 0 1000,236" />
        </svg>
      </motion.div>

      <div className="w-full flex flex-col lg:flex-row items-center gap-20 relative z-20 pointer-events-none">
        <div className="lg:w-[50%] space-y-12">
          <Heading align="right" subtitle="از مرز کدها">مهندسی فراتر</Heading>
          <p className="text-xl md:text-2xl font-sans text-zinc-400 leading-relaxed max-w-2xl text-justify">
            ما معتقدیم نرم‌افزار ابزار نیست؛ زیرساخت آینده است. هر خط کد، یک تصمیم راهبردی برای پایداری برند شماست. در گروه بقایی، هنر طراحی و قدرت مهندسی با هم ترکیب می‌شوند تا سیستم‌هایی خلق شوند که در مقیاس‌های میلیونی بدون وقفه عمل می‌کنند.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div className="space-y-1">
              <div className="text-lg font-bold text-white uppercase font-display tracking-normal">دقت مهندسی</div>
              <p className="text-xs font-medium text-white/60 text-right tracking-normal font-display">محاسبات بی نقص و بهینه.</p>
              <p className="text-[8px] font-normal text-zinc-600 text-right font-display opacity-80">این شبیه‌سازی لایو و بر اساس داده‌های واقعی نجومی است.</p>
            </div>
            <div className="space-y-1 text-left">
              <div className="text-lg font-bold text-white uppercase text-right font-display tracking-normal">پایداری سیستم</div>
              <p className="text-xs font-medium text-white/60 text-right tracking-normal font-display">تداوم عملیاتی در شرایط سخت.</p>
            </div>
          </div>
        </div>

        <div className="lg:w-[50%] flex items-center justify-center relative min-h-[600px]">
          <div className="relative w-full h-full flex items-center justify-center scale-75 md:scale-100">
            {/* The Sun with Magnet */}
            <motion.div 
              style={{ x: sunX, y: sunY }}
              data-cursor="black"
              className="absolute w-16 h-16 bg-yellow-500 rounded-full shadow-[0_0_60px_#eab308] z-10" 
            />
            
            {PLANETS_DATA.map((planet, i) => (
              <Planet 
                key={planet.id} 
                planet={planet} 
                mouseX={mouseXRel} 
                mouseY={mouseYRel} 
                index={i} 
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
