'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { toPersianDigits } from '@/lib/utils/format';
import { useTheme } from 'next-themes';

interface PlanetData {
  id: string;
  name: string;
  enName: string;
  diameter: number;
  au: number;
  period: number;
  temp: string;
  mass: string;
  color: string;
  texture: string;
  targetSection: string;
  isRetrograde?: boolean;
  hasMoon?: boolean;
  hasRing?: boolean;
}

interface EclipseData {
  size: number;
  offset: number;
  opacity: number;
}

/**
 * Realistic Solar System - NASA Scientific Data
 */
export const PLANETS_DATA: PlanetData[] = [
 { 
   id: 'mercury', name: 'عطارد', enName: 'Mercury', diameter: 4879, au: 0.39, period: 88.0, 
   temp: '۱۶۷°C', mass: '۳.۳ × ۱۰²³ kg', color: '#A5A5A5', 
   texture: 'radial-gradient(circle at 30% 30%, #A5A5A5, #4A4A4A)',
   targetSection: 'hero'
 },
 { 
   id: 'venus', name: 'زهره', enName: 'Venus', diameter: 12104, au: 0.72, period: 224.7, 
   temp: '۴۶۴°C', mass: '۴.۸ × ۱۰²۴ kg', color: '#E3BB76', isRetrograde: true, 
   texture: 'linear-gradient(45deg, #E3BB76, #A67C37)',
   targetSection: 'philosophy'
 },
 { 
   id: 'earth', name: 'زمین', enName: 'Earth', diameter: 12756, au: 1.00, period: 365.2, 
   temp: '۱۵°C', mass: '۵.۹ × ۱۰²۴ kg', color: '#2271B3', hasMoon: true, 
   texture: 'radial-gradient(circle at 30% 30%, #4B9CD3, #1E40AF)',
   targetSection: 'philosophy'
 },
 { 
   id: 'mars', name: 'مریخ', enName: 'Mars', diameter: 6792, au: 1.52, period: 687.0, 
   temp: '-۶۵°C', mass: '۶.۴ × ۱۰²۳ kg', color: '#E27B58', 
   texture: 'radial-gradient(circle at 60% 40%, #E27B58, #7C2D12)',
   targetSection: 'projects'
 },
 { 
   id: 'jupiter', name: 'مشتری', enName: 'Jupiter', diameter: 142984, au: 5.20, period: 4331, 
   temp: '-۱۱۰°C', mass: '۱.۹ × ۱۰²⁷ kg', color: '#D39C7E', 
   texture: 'linear-gradient(to bottom, #D39C7E 0%, #AF8069 20%, #D39C7E 40%, #AF8069 60%, #D39C7E 80%)',
   targetSection: 'services'
 },
 { 
   id: 'saturn', name: 'زحل', enName: 'Saturn', diameter: 120536, au: 9.54, period: 10747, 
   temp: '-۱۴۰°C', mass: '۵.۶ × ۱۰²۶ kg', color: '#C5AB6E', hasRing: true, 
   texture: 'linear-gradient(to bottom, #C5AB6E 0%, #8E7A42 25%, #C5AB6E 50%, #8E7A42 75%, #C5AB6E 100%)',
   targetSection: 'services'
 },
 { 
   id: 'uranus', name: 'اورانوس', enName: 'Uranus', diameter: 51118, au: 19.22, period: 30589, 
   temp: '-۱۹۵°C', mass: '۸.۶ × ۱۰²۵ kg', color: '#B5E3E3', isRetrograde: true, 
   texture: 'radial-gradient(circle at 50% 50%, #B5E3E3, #5DA5A5)',
   targetSection: 'contact'
 },
 { 
   id: 'neptune', name: 'نپتون', enName: 'Neptune', diameter: 49528, au: 30.06, period: 59800, 
   temp: '-۲۰۰°C', mass: '۱.۰ × ۱۰²۶ kg', color: '#6081FF', 
   texture: 'radial-gradient(circle at 50% 50%, #6081FF, #1E3A8A)',
   targetSection: 'contact'
 },
];

export const GalaxyBackground = ({ scrollProgress }: { scrollProgress: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const starsRef = useRef<{ x: number, y: number, size: number, opacity: number, parallax: number, twinkle: number }[] | null>(null);

  if (!starsRef.current) {
    starsRef.current = [...Array(600)].map(() => ({
      x: Math.random() * 5000,
      y: Math.random() * 5000,
      size: 0.1 + Math.random() * 1.1,
      opacity: 0.02 + Math.random() * 0.25,
      parallax: 0.02 + Math.random() * 0.2,
      twinkle: 1 + Math.random() * 4
    }));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      
      starsRef.current?.forEach(s => {
        const xPos = s.x % width;
        const yPos = (s.y + scrollProgress * 1000 * s.parallax) % height;
        const starColor = resolvedTheme === 'dark' ? '255, 255, 255' : '0, 0, 0';
        const twinkle = 0.7 + Math.sin((Date.now() * 0.002 * s.twinkle) + s.x) * 0.3;
        
        ctx.fillStyle = `rgba(${starColor}, ${s.opacity * twinkle})`; 
        ctx.beginPath();
        ctx.arc(xPos, yPos, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationId);
  }, [scrollProgress, resolvedTheme]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

const PlanetBody = ({ planet, eclipseData, scrollProgress, moonEclipse }: { planet: PlanetData, eclipseData: EclipseData | null, scrollProgress: number, moonEclipse?: { isSolar: boolean, isLunar: boolean } }) => {
 const earthDiameter = 12756;
 const earthSizeBase = 4;
 const pSize = (planet.diameter / earthDiameter) * earthSizeBase;
 const finalSize = planet.diameter > 50000 ? 10 + Math.log10(planet.diameter/10000) * 12 : pSize + 2;

 const moonRotate = scrollProgress * 96 * 360;

 return (
  <motion.div 
   onClick={() => {
     if (planet.targetSection) {
       document.getElementById(planet.targetSection)?.scrollIntoView({ behavior: 'smooth' });
     }
   }}
   style={{ width: finalSize, height: finalSize, zIndex: 20 }}
   className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/planet active:scale-95 transition-transform"
  >
   <div className="w-full h-full rounded-full relative overflow-hidden shadow-2xl pointer-events-none" style={{ background: planet.texture }}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3)_0%,transparent_60%)]" />
   </div>

   <div 
    className="absolute inset-0 rounded-full pointer-events-none"
    style={{ 
      background: `linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)`,
      zIndex: 25
    }} 
   />

   {planet.id === 'earth' && moonEclipse?.isSolar && (
     <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
        <div className="w-[20%] h-[20%] bg-black/90 rounded-full blur-[1px] shadow-[0_0_8px_black]" />
     </div>
   )}

   {eclipseData && (
     <div className="absolute inset-0 rounded-full overflow-hidden z-30 pointer-events-none" style={{ opacity: eclipseData.opacity }}>
        <div 
          className="absolute bg-black/95 rounded-full blur-[3px]"
          style={{ 
            width: `${eclipseData.size * 120}%`,
            height: `${eclipseData.size * 120}%`,
            left: '50%', top: '100%', 
            transform: `translate(-50%, -70%) translateX(${eclipseData.offset * 80}%)`,
            boxShadow: '0 0 15px 5px rgba(0,0,0,0.7)'
          }}
        />
     </div>
   )}

   {planet.hasRing && (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280%] h-[20%] rounded-full rotate-[15deg] pointer-events-none" 
     style={{ 
       background: `radial-gradient(ellipse at center, transparent 45%, ${planet.color}33 46%, ${planet.color}11 65%, transparent 70%)`, 
       border: `1px solid ${planet.color}22` 
     }}
    />
   )}

   {planet.hasMoon && (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 35, height: 35 }}>
     <motion.div 
      className="absolute inset-0 will-change-transform" 
      style={{ rotate: moonRotate }}
     >
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full transition-colors duration-500" 
        style={{ 
            width: 2, height: 2, 
            backgroundColor: moonEclipse?.isLunar ? '#7f1d1d' : '#d1d5db',
            boxShadow: moonEclipse?.isLunar ? '0 0 5px #ef4444' : '0 0 4px rgba(255,255,255,0.8)',
            zIndex: (moonRotate % 360) > 180 ? 10 : 30
        }} 
      />
     </motion.div>
    </div>
   )}
  </motion.div>
 );
};

const Planet = ({ planet, scrollProgress, allPlanets }: { planet: PlanetData, scrollProgress: number, allPlanets: PlanetData[] }) => {
 const pDist = 45 + Math.pow(planet.au, 0.55) * 140;
 
 const getAngle = (p: PlanetData, prog: number) => {
    const bA = 180 - (p.au * 12);
    const rD = p.isRetrograde ? -1 : 1;
    return (bA + (rD * (365.25 * 8 / p.period) * 360) * prog) % 360;
 };

 const currentAngle = getAngle(planet, scrollProgress);

 const moonEclipse = { isSolar: false, isLunar: false };
 if (planet.id === 'earth') {
    const moonAngleRelative = (scrollProgress * 96 * 360) % 360;
    if (Math.abs(moonAngleRelative - 180) < 5) moonEclipse.isSolar = true;
    if (Math.abs(moonAngleRelative - 0) < 5 || Math.abs(moonAngleRelative - 360) < 5) moonEclipse.isLunar = true;
 }

 let bestEclipse: EclipseData | null = null;
 for (const p of allPlanets) {
    if (p.au >= planet.au) continue;
    
    const innerAngle = getAngle(p, scrollProgress);
    const diff = ((innerAngle - currentAngle + 180 + 360) % 360) - 180;
    
    const outerAngRadius = (planet.diameter / (2 * planet.au * 1.5e8)) * 500000;
    const innerAngRadius = (p.diameter / (2 * p.au * 1.5e8)) * 500000;
    const threshold = innerAngRadius + outerAngRadius;
    
    if (Math.abs(diff) < threshold) {
        const shadowSizeRatio = (p.diameter / p.au) / (planet.diameter / planet.au);
        const offset = diff / outerAngRadius;
        const opacity = Math.max(0, 1 - Math.abs(diff) / threshold);
        
        if (!bestEclipse || opacity > bestEclipse.opacity) {
            bestEclipse = { size: shadowSizeRatio, offset, opacity };
        }
    }
 }

 return (
  <div className="absolute pointer-events-none" style={{ width: pDist * 2, height: pDist * 2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
   <div className="absolute inset-0 border rounded-full opacity-[0.08]" style={{ borderColor: planet.color }} />
   <motion.div 
    className="absolute inset-0 will-change-transform" 
    style={{ rotate: currentAngle }}
   >
    <PlanetBody planet={planet} eclipseData={bestEclipse} scrollProgress={scrollProgress} moonEclipse={moonEclipse} />
   </motion.div>
  </div>
 );
};

export default function GlobalUniverse({ renderBackground = false, scrollProgress: externalProgress }: { renderBackground?: boolean, scrollProgress?: number }) {
 const { scrollYProgress } = useScroll();
 const [progress, setProgress] = useState(0);
 
 useEffect(() => {
    return scrollYProgress.on('change', (v) => setProgress(v));
 }, [scrollYProgress]);

 const activeProgress = externalProgress !== undefined ? externalProgress : progress;

 if (renderBackground) {
    return <GalaxyBackground scrollProgress={activeProgress} />;
 }

 return (
  <div className="absolute inset-0 pointer-events-none z-[50]">
   <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-full h-full">
     <motion.div 
      id="sun-element" 
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" 
      style={{ width: 45, height: 45 }}
     >
      <div className="absolute inset-[-60px] rounded-full bg-orange-500/10 blur-[40px] animate-pulse" />
      <div className="absolute inset-[-20px] rounded-full bg-yellow-500/20 blur-[20px]" />
      <div className="absolute inset-0 rounded-full bg-[#FFD700] shadow-[0_0_40px_rgba(255,165,0,0.6)]" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFFFFF_0%,#FFD700_40%,#FF8C00_100%)]" />
      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] opacity-40" />
     </motion.div>
     {PLANETS_DATA.map((planet) => (
      <Planet 
        key={planet.id} 
        planet={planet} 
        scrollProgress={activeProgress} 
        allPlanets={PLANETS_DATA} 
      />
     ))}
    </div>
   </div>
  </div>
 );
}