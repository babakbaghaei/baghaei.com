'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useInView, MotionValue, useMotionValue } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { toPersianDigits } from '@/lib/utils/format';
import { useSound } from '@/lib/utils/sounds';
import { StatItem } from '../ui/StatItem';

const PLANETS_DATA = [
  { id: 'mercury', name: 'عطارد', diameter: 4879, au: 0.39, period: 88.0, mass: 0.330, color: '#A5A5A5', texture: 'radial-gradient(circle at 30% 30%, #A5A5A5, #4A4A4A)' },
  { id: 'venus', name: 'زهره', diameter: 12104, au: 0.72, period: 224.7, mass: 4.87, color: '#E3BB76', isRetrograde: true, texture: 'linear-gradient(45deg, #E3BB76, #A67C37)' },
  { id: 'earth', name: 'زمین', diameter: 12756, au: 1.00, period: 365.2, mass: 5.97, color: '#2271B3', hasMoon: true, texture: 'radial-gradient(circle at 30% 30%, #4B9CD3, #1E40AF)' },
  { id: 'mars', name: 'مریخ', diameter: 6792, au: 1.52, period: 687.0, mass: 0.642, color: '#E27B58', texture: 'radial-gradient(circle at 60% 40%, #E27B58, #7C2D12)' },
  { id: 'jupiter', name: 'مشتری', diameter: 142984, au: 5.20, period: 4331, mass: 1899, color: '#D39C7E', texture: 'linear-gradient(to bottom, #D39C7E 0%, #AF8069 20%, #D39C7E 40%, #AF8069 60%, #D39C7E 80%)' },
  { id: 'saturn', name: 'زحل', diameter: 120536, au: 9.54, period: 10747, mass: 568, color: '#C5AB6E', hasRing: true, texture: 'linear-gradient(to bottom, #C5AB6E 0%, #8E7A42 25%, #C5AB6E 50%, #8E7A42 75%, #C5AB6E 100%)' },
  { id: 'uranus', name: 'اورانوس', diameter: 51118, au: 19.22, period: 30589, mass: 86.8, color: '#B5E3E3', isRetrograde: true, texture: 'radial-gradient(circle at 50% 50%, #B5E3E3, #5DA5A5)' },
  { id: 'neptune', name: 'نپتون', diameter: 49528, au: 30.06, period: 59800, mass: 102, color: '#6081FF', texture: 'radial-gradient(circle at 50% 50%, #6081FF, #1E3A8A)' },
];

const stats = [
  { label: 'شرکت بزرگ', value: '+۵' },
  { label: 'پایداری سیستم', value: '۹۹.۹٪' },
  { label: 'پشتیبانی فنی', value: '۲۴ ساعته' }
];

const PlanetBody = ({ planet, scrollProgress }: { planet: any, scrollProgress: MotionValue<number> }) => {
  const pSize = (planet.diameter / 12756) * 4;
  const finalSize = planet.diameter > 50000 ? 12 + Math.log10(planet.diameter/50000) * 15 : pSize + 2;
  
  // Moon rotates 120 times in 10 years (at 0.5 global scroll)
  const moonRotate = useTransform(scrollProgress, [0, 1], [0, 240 * 360]);

  return (
    <motion.div style={{ width: finalSize, height: finalSize, zIndex: 20 }} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-full h-full rounded-full relative overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.4)]" style={{ background: planet.texture }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.4)_0%,transparent_60%)]" />
      </div>
      {planet.hasMoon && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 25, height: 25 }}>
          <div className="absolute inset-0 border border-solid border-white/10 rounded-full" />
          <motion.div className="absolute inset-0" style={{ rotate: moonRotate }}>
            <div className="absolute top-0 left-1/2 bg-zinc-400 rounded-full -translate-x-1/2 shadow-[0_0_5px_white]" style={{ width: 2, height: 2 }} />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const Planet = ({ planet, scrollProgress }: { planet: any, scrollProgress: MotionValue<number> }) => {
  const pDist = planet.au * 350;
  const rotationDir = planet.isRetrograde ? -1 : 1;
  const baseAngle = 90 - (planet.au * 10);
  
  // Rotating 20 years worth over the entire page scroll for maximum visibility
  const rotate = useTransform(
    scrollProgress, 
    [0, 1], 
    [baseAngle, baseAngle + (rotationDir * (3652.5 * 2 / planet.period) * 360)]
  );

  return (
    <div className="absolute pointer-events-none" style={{ width: pDist * 2, height: pDist * 2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <div className="absolute inset-0 border border-solid border-white/5 rounded-full" style={{ borderWidth: '0.5px', opacity: 0.1 }} />
      <motion.div className="absolute inset-0" style={{ rotate }}>
        <PlanetBody planet={planet} scrollProgress={scrollProgress} />
      </motion.div>
    </div>
  );
};

export default function Philosophy() {
  const { play } = useSound();
  const containerRef = useRef(null);
  
  // 1. GLOBAL SCROLL - 100% Guaranteed to update and rotate
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 30, damping: 40 });

  // 2. Counter logic - Pure state based to avoid NaN/Hydration issues
  const [years, setYears] = useState(0);
  const isVisible = useInView(containerRef, { amount: 0.3, once: false });

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setYears(prev => (prev < 10 ? prev + 1 : 10));
      }, 80);
      return () => clearInterval(interval);
    } else {
      setYears(0);
    }
  }, [isVisible]);

  const yearsDisplay = `${toPersianDigits(years)}+`;

  return (
    <Section id="philosophy" className="!py-0 min-h-screen border-y border-zinc-900 bg-black font-mono select-none overflow-hidden" containerClassName="h-full min-h-screen flex items-center justify-center py-20">
      <div ref={containerRef} className="w-full flex flex-col lg:flex-row items-center gap-20 relative z-20 pointer-events-none">
        <div className="lg:w-[50%] space-y-12 pointer-events-auto">
          <Heading align="right" subtitle="از مرز کدها">مهندسی فراتر</Heading>
          <p className="text-xl md:text-2xl font-sans text-zinc-400 leading-relaxed max-w-2xl text-justify text-right">
            ما معتقدیم نرم‌افزار ابزار نیست؛ زیرساخت آینده است. هر خط کد، یک تصمیم راهبردی برای پایداری برند شماست. در گروه بقایی، هنر طراحی و قدرت مهندسی با هم ترکیب می‌شوند تا سیستم‌هایی خلق شوند که در مقیاس‌های میلیونی بدون وقفه عمل می‌کنند.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
            <StatItem label="سال تجربه" value={yearsDisplay} />
            {stats.map((stat, i) => <StatItem key={i} label={stat.label} value={stat.value} />)}
          </div>
        </div>

        <div className="lg:w-[50%] flex items-center justify-center relative min-h-[600px] pointer-events-auto">
          <div className="relative w-full h-full flex items-center justify-center scale-90 md:scale-110">
            {/* THE SUN */}
            <div className="absolute bg-yellow-500 rounded-full shadow-[0_0_100px_rgba(234,179,8,0.6)] z-10" style={{ width: 40, height: 40 }}>
               <div className="absolute inset-[-10px] rounded-full bg-yellow-500/20 blur-xl animate-pulse" />
            </div>
            {PLANETS_DATA.map((planet) => (
              <Planet key={planet.id} planet={planet} scrollProgress={smoothProgress} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}