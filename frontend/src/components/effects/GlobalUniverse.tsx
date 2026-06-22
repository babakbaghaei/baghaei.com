'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

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

/**
 * Live ephemeris — real planetary positions.
 *
 * J2000 Keplerian elements from NASA/JPL low-precision formulae (Standish),
 * valid 1800–2050. Each entry holds the value at epoch J2000.0 and its rate
 * per Julian century for:
 *   L  — mean longitude (deg)
 *   e  — eccentricity
 *   w  — longitude of perihelion ϖ (deg)
 *
 * We solve the equation of centre so planets show their TRUE longitude
 * (real angular position on an ellipse), not the constant-speed mean — the
 * difference reaches ~23° for Mercury and ~10° for Mars.
 */
const ORBITAL_ELEMENTS: Record<string, { L0: number; Lr: number; e0: number; er: number; w0: number; wr: number }> = {
  mercury: { L0: 252.25032350, Lr: 149472.67411175, e0: 0.20563593, er:  0.00001906, w0:  77.45779628, wr:  0.16047689 },
  venus:   { L0: 181.97909950, Lr:  58517.81538729, e0: 0.00677672, er: -0.00004107, w0: 131.60246718, wr:  0.00268329 },
  earth:   { L0: 100.46457166, Lr:  35999.37244981, e0: 0.01671123, er: -0.00004392, w0: 102.93768193, wr:  0.32327364 },
  mars:    { L0:  -4.55343205, Lr:  19140.30268499, e0: 0.09339410, er:  0.00007882, w0: -23.94362959, wr:  0.44441088 },
  jupiter: { L0:  34.39644051, Lr:   3034.74612775, e0: 0.04838624, er: -0.00013253, w0:  14.72847983, wr:  0.21252668 },
  saturn:  { L0:  49.95424423, Lr:   1222.49362201, e0: 0.05386179, er: -0.00050991, w0:  92.59887831, wr: -0.41897216 },
  uranus:  { L0: 313.23810451, Lr:    428.48202785, e0: 0.04725744, er: -0.00004397, w0: 170.95427630, wr:  0.40805281 },
  neptune: { L0: -55.12002969, Lr:    218.45945325, e0: 0.00859048, er:  0.00005105, w0:  44.96476227, wr: -0.32241464 },
};

const DEG = Math.PI / 180;
const norm360 = (deg: number) => ((deg % 360) + 360) % 360;
// Wrap to the symmetric range (−180, 180].
const norm180 = (deg: number) => { const x = norm360(deg); return x > 180 ? x - 360 : x; };

// Days elapsed since the J2000.0 epoch (2000-01-01 12:00 TT, JD 2451545.0).
const daysSinceJ2000 = (date: Date) =>
  date.getTime() / 86400000 + 2440587.5 - 2451545.0;

// True heliocentric ecliptic longitude (deg) of a planet at a given instant.
const planetLongitude = (id: string, date: Date) => {
  const el = ORBITAL_ELEMENTS[id];
  if (!el) return 0;
  const T = daysSinceJ2000(date) / 36525;
  const L = el.L0 + el.Lr * T;          // mean longitude
  const e = el.e0 + el.er * T;          // eccentricity
  const w = el.w0 + el.wr * T;          // longitude of perihelion
  const M = norm180(L - w) * DEG;       // mean anomaly
  // Equation of centre (radians) → true longitude = mean longitude + C.
  const C =
    (2 * e - (e ** 3) / 4) * Math.sin(M) +
    1.25 * e * e * Math.sin(2 * M) +
    (13 / 12) * (e ** 3) * Math.sin(3 * M);
  return norm360(L + C / DEG);
};

// Sun's geocentric longitude is opposite Earth's heliocentric longitude.
const sunLongitude = (date: Date) => norm360(planetLongitude('earth', date) + 180);

// Moon's geocentric ecliptic longitude (deg): mean longitude + main elliptic
// term (Meeus). Good enough for showing the real phase / eclipse timing.
const moonLongitude = (date: Date) => {
  const d = daysSinceJ2000(date);
  const meanLon = 218.3164477 + 13.17639648 * d;
  const meanAnom = (134.9633964 + 13.06499295 * d) * DEG;
  return norm360(meanLon + 6.289 * Math.sin(meanAnom));
};

// Map a real ecliptic longitude (0°=+x, increasing counter-clockwise) to the
// CSS rotation of an orbit ring whose body sits at the top. This reproduces a
// conventional "view from the north" star chart instead of a mirrored one.
const longitudeToScreenAngle = (lon: number) => norm360(90 - lon);

// Human-readable Persian names for the page sections each planet links to, used
// to build descriptive aria-labels for the clickable planet controls.
const SECTION_LABELS: Record<string, string> = {
  hero: 'خانه',
  philosophy: 'فلسفه',
  projects: 'پروژه‌ها',
  services: 'خدمات',
  contact: 'تماس',
};

// Scrolling the page fast-forwards time so the orbits visibly advance, just
// like before — but now anchored to the real "now". A full-page scroll spans
// eight years of simulated motion.
const SCROLL_TIME_SPAN_MS = 8 * 365.25 * 86400000;

export const GalaxyBackground = ({ scrollProgress, observeVisibility = false }: { scrollProgress: number, observeVisibility?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const starsRef = useRef<{ x: number, y: number, size: number, opacity: number, parallax: number, twinkle: number }[] | null>(null);
  // Track scrollProgress in a ref so updating it never tears down / restarts
  // the requestAnimationFrame loop (which previously happened on every scroll
  // frame and was the main cause of jank / the tab locking up).
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  if (!starsRef.current) {
    // Responsive density: thin the field on small screens so it never becomes
    // textured noise behind Persian copy. Falls back to a mid count during SSR
    // (the server render paints no canvas, so the value is only a placeholder).
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const starCount = vw < 768 ? 450 : vw < 1280 ? 800 : 1100;
    starsRef.current = [...Array(starCount)].map(() => ({
      x: Math.random() * 5000,
      y: Math.random() * 5000,
      size: 0.2 + Math.random() * 1.8,
      // Lower opacity ceiling (~0.4 vs 0.65) keeps foreground text readable
      // while the twinkle below still gives the field life.
      opacity: 0.08 + Math.random() * 0.32,
      parallax: 0.02 + Math.random() * 0.2,
      twinkle: 1 + Math.random() * 4
    }));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect the user's reduced-motion preference: draw a single static
    // starfield (no twinkle, no animation loop) instead of running RAF forever.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Resize the canvas bitmap only when the viewport actually changes — not on
    // every animation frame. Re-assigning canvas.width/height each frame forces
    // a full buffer reallocation + state reset, which is extremely expensive.
    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      // setTransform (not scale) is idempotent, so DPR never compounds.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = resolvedTheme === 'dark';
      const starColor = isDark ? '255, 255, 255' : '0, 0, 0';
      // Black stars on a white page read as noise, so dim them heavily in light mode.
      const themeOpacityFactor = isDark ? 1 : 0.3;
      const sp = scrollRef.current;
      const now = Date.now();
      starsRef.current?.forEach(s => {
        const xPos = s.x % width;
        const yPos = (s.y + sp * 1000 * s.parallax) % height;
        const twinkle = prefersReducedMotion
          ? 1
          : 0.7 + Math.sin((now * 0.002 * s.twinkle) + s.x) * 0.3;

        ctx.fillStyle = `rgba(${starColor}, ${s.opacity * twinkle * themeOpacityFactor})`;
        ctx.beginPath();
        ctx.arc(xPos, yPos, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let animationId = 0;
    const render = () => {
      draw();
      animationId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);

    if (prefersReducedMotion) {
      // Reduced motion: draw a single static frame, no rAF loop at all (and no
      // need to observe visibility since nothing is animating).
      draw();
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    // Pause the rAF loop while the canvas is scrolled off-screen so it stops
    // burning the main thread on an invisible field. Only the sized/hero
    // variant opts in via `observeVisibility` — the fixed full-screen
    // background is effectively always visible and must never be frozen.
    let observer: IntersectionObserver | null = null;
    const start = () => {
      if (!animationId) render();
    };
    const stop = () => {
      cancelAnimationFrame(animationId);
      animationId = 0;
    };

    if (observeVisibility && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            start();
          } else {
            stop();
          }
        },
        { threshold: 0 }
      );
      observer.observe(canvas);
      // Don't start here: the observer delivers an initial callback (next frame)
      // with the current intersection state, which kicks off the loop if the
      // canvas is visible — a one-frame delay that is imperceptible.
    } else {
      start();
    }

    return () => {
      stop();
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [resolvedTheme, observeVisibility]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

const PlanetBody = ({ planet, eclipseData, moonRotate = 0, moonEclipse }: { planet: PlanetData, eclipseData: EclipseData | null, moonRotate?: number, moonEclipse?: { isSolar: boolean, isLunar: boolean } }) => {
 const earthDiameter = 12756;
 const earthSizeBase = 4;
 const pSize = (planet.diameter / earthDiameter) * earthSizeBase;
 const finalSize = planet.diameter > 50000 ? 10 + Math.log10(planet.diameter/10000) * 12 : pSize + 2;

 const isClickable = !!planet.targetSection;
 const goToSection = () => {
   if (planet.targetSection) {
     document.getElementById(planet.targetSection)?.scrollIntoView({ behavior: 'smooth' });
   }
 };
 const sectionLabel = SECTION_LABELS[planet.targetSection] || planet.targetSection;

 return (
  <motion.div
   {...(isClickable
     ? {
         onClick: goToSection,
         onKeyDown: (e: React.KeyboardEvent) => {
           if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
             e.preventDefault();
             goToSection();
           }
         },
         role: 'button',
         tabIndex: 0,
         'aria-label': `${planet.name} — رفتن به بخش ${sectionLabel}`,
       }
     : { 'aria-hidden': true })}
   style={{ width: finalSize, height: finalSize, zIndex: 20 }}
   className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group/planet active:scale-95 transition-transform rounded-full ${isClickable ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black' : ''}`}
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

const Planet = ({ planet, date, allPlanets }: { planet: PlanetData, date: Date, allPlanets: PlanetData[] }) => {
 const pDist = 45 + Math.pow(planet.au, 0.55) * 140;

 // Real heliocentric longitude → on-screen orbital angle.
 const currentAngle = planetLongitude(planet.id, date);

 const moonEclipse = { isSolar: false, isLunar: false };
 let moonRotate = 0;
 if (planet.id === 'earth') {
    // Elongation of the Moon from the Sun: 0° = new moon, 180° = full moon.
    const elongation = norm360(moonLongitude(date) - sunLongitude(date));
    // Earth's frame points away from the Sun at the top (rotate 0), so the
    // far-side full moon sits at 0° and the sunward new moon at 180°.
    moonRotate = norm360(180 - elongation);
    const distNew = Math.min(elongation, 360 - elongation);
    const distFull = Math.abs(elongation - 180);
    if (distNew < 3) moonEclipse.isSolar = true;
    if (distFull < 3) moonEclipse.isLunar = true;
 }

 let bestEclipse: EclipseData | null = null;
 for (const p of allPlanets) {
    if (p.au >= planet.au) continue;

    const innerAngle = planetLongitude(p.id, date);
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
    style={{ rotate: longitudeToScreenAngle(currentAngle) }}
   >
    <PlanetBody planet={planet} eclipseData={bestEclipse} moonRotate={moonRotate} moonEclipse={moonEclipse} />
   </motion.div>
  </div>
 );
};

export default function GlobalUniverse({ renderBackground = false, scrollProgress: externalProgress }: { renderBackground?: boolean, scrollProgress?: number }) {
 const { scrollYProgress } = useScroll();
 const [progress, setProgress] = useState(0);
 const prefersReducedMotion = usePrefersReducedMotion();

 useEffect(() => {
    return scrollYProgress.on('change', (v) => setProgress(v));
 }, [scrollYProgress]);

 const activeProgress = externalProgress !== undefined ? externalProgress : progress;

 // Live clock for the foreground solar system. Planets are positioned from
 // the real current date, refreshed every minute so the view stays accurate.
 const [now, setNow] = useState<Date | null>(null);
 useEffect(() => {
    const tick = () => setNow(new Date());
    // Defer the first tick out of the effect body to avoid a synchronous
    // setState (and keep the clock strictly client-side for hydration safety).
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 60000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
 }, []);

 if (renderBackground) {
    // Observe the canvas so the starfield rAF loop pauses whenever it is
    // scrolled out of the viewport. The site mounts this inside a `fixed
    // inset-0` wrapper, so it always intersects and is never wrongly frozen;
    // the observer only ever pauses it in a non-fixed/scrollable host.
    return <GalaxyBackground scrollProgress={activeProgress} observeVisibility />;
 }

 // Avoid a server/client hydration mismatch: render nothing until the
 // client-side clock is set. The base is the real "now" (live), and scrolling
 // fast-forwards time from there so the orbits animate just like before.
 // Under reduced motion we anchor to the live "now" only — scrolling no longer
 // advances simulated time, so the planets/moon hold a single static position
 // (the declarative motion.div rotations are already neutralised by the root
 // <MotionConfig reducedMotion="user">, this stops the value itself moving).
 const date = now
   ? new Date(now.getTime() + (prefersReducedMotion ? 0 : activeProgress * SCROLL_TIME_SPAN_MS))
   : null;

 return (
  <div className="absolute inset-0 pointer-events-none z-[50]">
   <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-full h-full">
     <motion.div 
      id="sun-element" 
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" 
      style={{ width: 45, height: 45 }}
     >
      <div className={`absolute inset-[-60px] rounded-full bg-orange-500/10 blur-[40px] ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
      <div className="absolute inset-[-20px] rounded-full bg-yellow-500/20 blur-[20px]" />
      <div className="absolute inset-0 rounded-full bg-[#FFD700] shadow-[0_0_40px_rgba(255,165,0,0.6)]" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFFFFF_0%,#FFD700_40%,#FF8C00_100%)]" />
      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] opacity-40" />
     </motion.div>
     {date && PLANETS_DATA.map((planet) => (
      <Planet
        key={planet.id}
        planet={planet}
        date={date}
        allPlanets={PLANETS_DATA}
      />
     ))}
    </div>
   </div>
  </div>
 );
}