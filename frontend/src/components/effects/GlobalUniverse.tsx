'use client';

import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue, useMotionValue } from 'framer-motion';
import { toPersianDigits } from '@/lib/utils/format';

/**
 * Quantum Global Solar System - Data from NASA
 */
export const PLANETS_DATA = [
 { id: 'mercury', name: 'عطارد', diameter: 4879, au: 0.39, period: 88.0, mass: 0.330, color: '#A5A5A5', texture: 'radial-gradient(circle at 30% 30%, #A5A5A5, #4A4A4A)' },
 { id: 'venus', name: 'زهره', diameter: 12104, au: 0.72, period: 224.7, mass: 4.87, color: '#E3BB76', isRetrograde: true, texture: 'linear-gradient(45deg, #E3BB76, #A67C37)' },
 { id: 'earth', name: 'زمین', diameter: 12756, au: 1.00, period: 365.2, mass: 5.97, color: '#2271B3', hasMoon: true, texture: 'radial-gradient(circle at 30% 30%, #4B9CD3, #1E40AF)' },
 { id: 'mars', name: 'مریخ', diameter: 6792, au: 1.52, period: 687.0, mass: 0.642, color: '#E27B58', texture: 'radial-gradient(circle at 60% 40%, #E27B58, #7C2D12)' },
 { id: 'jupiter', name: 'مشتری', diameter: 142984, au: 5.20, period: 4331, mass: 1899, color: '#D39C7E', texture: 'linear-gradient(to bottom, #D39C7E 0%, #AF8069 20%, #D39C7E 40%, #AF8069 60%, #D39C7E 80%)' },
 { id: 'saturn', name: 'زحل', diameter: 120536, au: 9.54, period: 10747, mass: 568, color: '#C5AB6E', hasRing: true, texture: 'linear-gradient(to bottom, #C5AB6E 0%, #8E7A42 25%, #C5AB6E 50%, #8E7A42 75%, #C5AB6E 100%)' },
 { id: 'uranus', name: 'اورانوس', diameter: 51118, au: 19.22, period: 30589, mass: 86.8, color: '#B5E3E3', isRetrograde: true, texture: 'radial-gradient(circle at 50% 50%, #B5E3E3, #5DA5A5)' },
 { id: 'neptune', name: 'نپتون', diameter: 49528, au: 30.06, period: 59800, mass: 102, color: '#6081FF', texture: 'radial-gradient(circle at 50% 50%, #6081FF, #1E3A8A)' },
];

const PlanetBody = ({ planet, scrollProgress }: { planet: any, scrollProgress: MotionValue<number> }) => {
 const earthDiameter = 12756;
 const earthSizeBase = 4;
 const pSize = (planet.diameter / earthDiameter) * earthSizeBase;
 const finalSize = planet.diameter > 50000 ? 12 + Math.log10(planet.diameter/50000) * 15 : pSize + 2;

 const x = useMotionValue(0);
 const y = useMotionValue(0);
 const moonRotate = useTransform(scrollProgress, [0, 1], [0, 36 * 360]);

 return (
  <motion.div 
   style={{ x, y, width: finalSize, height: finalSize, zIndex: 20 }}
   className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
  >
   <div className="w-full h-full rounded-full relative overflow-hidden shadow-2xl pointer-events-none" style={{ background: planet.texture }}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.4)_0%,transparent_60%)]" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
   </div>

   {planet.hasRing && (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280%] h-[20%] rounded-full rotate-[15deg] pointer-events-none" 
     style={{ background: 'radial-gradient(ellipse at center, transparent 48%, rgba(255,255,255,0.15) 49%, rgba(255,255,255,0.05) 70%, transparent 71%)', border: '1px solid rgba(255,255,255,0.1)' }}
    />
   )}
   
   {planet.hasMoon && (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 30, height: 30 }}>
     <motion.div className="absolute inset-0 will-change-transform" style={{ rotate: moonRotate }}>
      <div className="absolute top-0 left-1/2 bg-muted-foreground rounded-full -translate-x-1/2 shadow-[0_0_5px_currentColor] text-foreground" style={{ width: 2, height: 2 }} />
     </motion.div>
    </div>
   )}
  </motion.div>
 );
};

const Planet = ({ planet, scrollProgress }: { planet: any, scrollProgress: MotionValue<number> }) => {
 const pDist = 60 + Math.pow(planet.au, 0.7) * 250;
 const baseAngle = 90 - (planet.au * 15); 
 const rotationDir = planet.isRetrograde ? -1 : 1;
 // Reduced time scale to 3 years over the full scroll to prevent aliasing/stuttering
 const rotate = useTransform(scrollProgress, [0, 1], [baseAngle, baseAngle + (rotationDir * (365.25 * 3 / planet.period) * 360)]);

 return (
  <div className="absolute pointer-events-none" style={{ width: pDist * 2, height: pDist * 2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
   <motion.div className="absolute inset-0 will-change-transform" style={{ rotate }}>
    <PlanetBody planet={planet} scrollProgress={scrollProgress} />
   </motion.div>
  </div>
 );
};

export default function GlobalUniverse() {
 const { scrollYProgress } = useScroll();
 const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20, mass: 1, restSpeed: 0.0001, restDelta: 0.000001 });
 
 return (
  <div className="absolute inset-0 pointer-events-none z-[50] overflow-visible">
   {/* Deep Space Starfield - Optional if we want it to bleed out */}
   
   <motion.div 
    style={{ opacity: 1, scale: 1 }}
    className="absolute w-[1200px] h-[1200px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
   >
    <div className="relative w-full h-full flex items-center justify-center">
     {/* THE SUN - 40px with massive bloom */}
     <div id="sun-element" className="absolute bg-yellow-500 rounded-full shadow-[0_0_200px_rgba(234,179,8,0.3)] z-10" style={{ width: 40, height: 40 }}>
      <div className="absolute inset-[-20px] rounded-full bg-yellow-500/10 blur-2xl animate-pulse" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-50" />
     </div>
     
     {PLANETS_DATA.map((planet) => (
      <Planet key={planet.id} planet={planet} scrollProgress={smoothProgress} />
     ))}
    </div>
   </motion.div>
  </div>
 );
}
