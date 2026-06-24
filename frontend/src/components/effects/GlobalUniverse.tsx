'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';
import { parallaxBus } from '@/lib/utils/parallaxBus';

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
  hasMoon?: boolean;
  hasRing?: boolean;
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
   temp: '۴۶۴°C', mass: '۴.۸ × ۱۰²۴ kg', color: '#E3BB76',
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
   temp: '-۱۹۵°C', mass: '۸.۶ × ۱۰²۵ kg', color: '#B5E3E3',
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

// ── Display scaling — "balanced realistic" ───────────────────────────────────
// PURELY VISUAL. None of these touch the ephemeris/longitude math, so the live
// planetary positions, eclipses and Moon phase stay exact regardless of how the
// system is sized. True linear-to-scale is impossible in a hero box (Neptune is
// 77× Mercury's distance; a to-scale Earth would sit *inside* the Sun), so we
// keep the real *ratios* and compress them with a gentle power law:
//
//   size  = (diameter / Earth)^SIZE_EXP × SIZE_BASE   → gas giants stay properly
//           dominant (Jupiter ≈ 8× Earth at exp 0.85) without dwarfing the hero.
//   orbit = DIST_OFFSET + AU^DIST_EXP × DIST_K        → outer worlds spread far,
//           inner four still clear the Sun. exp→1 = truer (but clips), exp↓ = tighter.
//
// Retune the look by editing only these seven numbers.
const EARTH_DIAMETER_KM = 12756;
const SIZE_EXP = 0.85;   // 1 = true diameter ratios; <1 tames the giants
const SIZE_BASE = 7;     // Earth's on-screen diameter (px) — the whole ramp scales off it
const SIZE_FLOOR = 5;    // smallest visual/click target (px) so Mercury/Mars stay grabbable
const DIST_EXP = 0.62;   // 1 = true linear AU; <1 pulls the outer giants inward to fit
const DIST_K = 97;       // orbit-radius scale (px)
const DIST_OFFSET = 21;  // base inset (px) so the inner orbits sit outside the Sun
const SUN_SIZE = 88;     // Sun core diameter (px) — kept larger than Jupiter so it dominates

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
// getTime() is UTC; ephemeris time is TT, which leads UTC by ΔT (~69s in 2025).
// The constant offset keeps planetary/lunar longitudes on the TT timescale the
// orbital elements assume — sub-arcsecond, but free correctness.
const daysSinceJ2000 = (date: Date) =>
  date.getTime() / 86400000 + 2440587.5 - 2451545.0 + 69.2 / 86400;

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

// Moon's geocentric ecliptic longitude (deg): mean longitude + the four
// largest periodic terms (Meeus) — equation of centre, evection, variation,
// and the annual equation. Accurate to ~0.2°, enough that eclipse timing lands
// on the right day rather than drifting hours.
const moonLongitude = (date: Date) => {
  const d = daysSinceJ2000(date);
  const meanLon = 218.3164477 + 13.17639648 * d;
  const M = (134.9633964 + 13.06499295 * d) * DEG;   // Moon mean anomaly
  const D = (297.8501921 + 12.19074912 * d) * DEG;   // mean elongation Moon–Sun
  const Msun = (357.5291092 + 0.98560028 * d) * DEG; // Sun mean anomaly
  return norm360(
    meanLon +
      6.289 * Math.sin(M) +
      1.274 * Math.sin(2 * D - M) +
      0.658 * Math.sin(2 * D) -
      0.186 * Math.sin(Msun)
  );
};

// Moon's ecliptic latitude (deg). Principal term in the argument of latitude F.
// This is what decides whether a syzygy is a real eclipse: the Moon must be
// within ~1.5° of the ecliptic, which is why most new/full moons miss.
const moonLatitude = (date: Date) => {
  const d = daysSinceJ2000(date);
  const F = (93.272095 + 13.22935024 * d) * DEG; // mean argument of latitude
  return 5.1281 * Math.sin(F);
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

// Parallax travel (px) the star field drifts across a full vertical page scroll
// or a full pass through the pinned-projects (horizontal) section.
const V_TRAVEL = 1000;
const H_TRAVEL = 1400;
// Positive modulo so accumulated (possibly negative) offsets wrap cleanly.
const wrapMod = (v: number, m: number) => ((v % m) + m) % m;

// ── Constellations ──────────────────────────────────────────────────────────
// Real naked-eye asterisms, coordinates normalised 0..1 inside their own box.
// Every route shows a DIFFERENT couple of these (steady bright stars joined by
// faint lines), so the night sky is never the same on two pages.
interface Asterism { fa: string; stars: [number, number][]; lines: [number, number][]; }
const ASTERISMS: Asterism[] = [
  { fa: 'دب اکبر', stars: [[0.00, 0.16], [0.18, 0.28], [0.37, 0.37], [0.55, 0.45], [0.60, 0.72], [0.84, 0.75], [0.82, 0.48]], lines: [[0, 1], [1, 2], [2, 3], [3, 6], [6, 5], [5, 4], [4, 3]] },
  { fa: 'جبار', stars: [[0.20, 0.08], [0.72, 0.12], [0.40, 0.50], [0.50, 0.52], [0.60, 0.55], [0.26, 0.93], [0.80, 0.92]], lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]] },
  { fa: 'ذات‌الکرسی', stars: [[0.00, 0.30], [0.25, 0.72], [0.50, 0.24], [0.75, 0.74], [1.00, 0.28]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { fa: 'دجاجه', stars: [[0.50, 0.00], [0.50, 0.45], [0.50, 1.00], [0.08, 0.40], [0.92, 0.52]], lines: [[0, 1], [1, 2], [3, 1], [1, 4]] },
  { fa: 'عقرب', stars: [[0.10, 0.06], [0.20, 0.22], [0.32, 0.34], [0.46, 0.46], [0.56, 0.62], [0.62, 0.78], [0.52, 0.90], [0.36, 0.92]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]] },
  { fa: 'شلیاق', stars: [[0.20, 0.06], [0.36, 0.36], [0.58, 0.46], [0.66, 0.78], [0.44, 0.66]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]] },
  { fa: 'اسد', stars: [[0.10, 0.80], [0.16, 0.55], [0.22, 0.36], [0.34, 0.28], [0.52, 0.40], [0.92, 0.52], [0.66, 0.60]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 6], [6, 5], [5, 4]] },
  { fa: 'صلیب جنوبی', stars: [[0.50, 0.00], [0.50, 1.00], [0.06, 0.46], [0.94, 0.56]], lines: [[0, 1], [2, 3]] },
];
// Screen anchors (fractions) the constellations snap to — spread around, away
// from the dead centre where the hero headline sits.
const ANCHORS: [number, number][] = [[0.16, 0.24], [0.30, 0.72], [0.78, 0.28], [0.68, 0.80], [0.12, 0.56], [0.86, 0.60], [0.44, 0.16]];
const hashStr = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

export const GalaxyBackground = ({ scrollProgress, observeVisibility = false }: { scrollProgress: number, observeVisibility?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const milkyRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const starsRef = useRef<{ x: number, y: number, size: number, opacity: number, parallax: number, twinkle: number, twinkles: boolean, color: string }[] | null>(null);
  // Track scrollProgress in a ref so updating it never tears down / restarts
  // the requestAnimationFrame loop (which previously happened on every scroll
  // frame and was the main cause of jank / the tab locking up).
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;
  // Smoothed scroll velocity (per-frame delta of scrollProgress). Lives in a
  // ref so it never restarts the rAF loop. Drives streak length + brightness.
  const velRef = useRef(0);
  const prevScrollRef = useRef(scrollProgress);
  // Axis-separated parallax: horizontal advances only while the projects pin is
  // active, vertical only otherwise. Delta-accumulated so the switch never jumps.
  const prevHxRef = useRef(0);
  const hAccumRef = useRef(0);
  const vAccumRef = useRef(0);
  // Per-route constellations + an idle "shooting star".
  const pathname = usePathname();
  const placedRef = useRef<{ ast: Asterism, ax: number, ay: number, scale: number }[]>([]);
  const meteorRef = useRef<{ x: number, y: number, vx: number, vy: number, life: number, maxLife: number } | null>(null);
  const lastActivityRef = useRef(0);
  const lastMeteorRef = useRef(0);

  if (!starsRef.current) {
    // Responsive density: thin the field on small screens so it never becomes
    // textured noise behind Persian copy. Falls back to a mid count during SSR
    // (the server render paints no canvas, so the value is only a placeholder).
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    // Constant areal density instead of magic per-breakpoint counts: ~1 star per
    // 2000px² of viewport, clamped so phones never go sparse and 4K never turns
    // to noise. Density now reads consistent on every display.
    // Discount by devicePixelRatio: a 2× retina panel paints every star across
    // 4 physical pixels, so the same areal count costs ~4× the fill. Thinning
    // it keeps the field calm and cheap on high-DPR screens without going sparse.
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const starCount = Math.max(220, Math.min(Math.round((vw * vh) / (2000 * Math.max(dpr, 1))), 900));
    starsRef.current = [...Array(starCount)].map(() => {
      // Real stellar colours by temperature (what the eye actually sees): mostly
      // white & blue-white, fewer warm yellow/orange, a rare red. No uniform tint.
      const r = Math.random();
      const color =
        r < 0.40 ? '255, 255, 255' :   // white
        r < 0.62 ? '202, 216, 255' :   // blue-white
        r < 0.80 ? '255, 247, 232' :   // yellow-white
        r < 0.90 ? '255, 233, 180' :   // yellow (Sun-like)
        r < 0.97 ? '255, 206, 150' :   // orange
                   '255, 180, 150';    // red
      return {
        x: Math.random() * 5000,
        y: Math.random() * 5000,
        size: 0.2 + Math.random() * 1.8,
        // Lower opacity ceiling (~0.4 vs 0.65) keeps foreground text readable
        // while the twinkle below still gives the field life.
        opacity: 0.08 + Math.random() * 0.32,
        parallax: 0.02 + Math.random() * 0.2,
        twinkle: 1 + Math.random() * 4,
        // Only ~30% scintillate — real skies aren't a field of blinkers.
        twinkles: Math.random() < 0.3,
        color,
      };
    });
  }

  // Choose this route's constellations. Different pathname → different hash →
  // different asterisms + anchors, with no repeat within a single page.
  useEffect(() => {
    const path = pathname || '/';
    const count = 2 + (hashStr(path) % 2); // 2 or 3 per page
    const orderA = ASTERISMS.map((_, i) => i).sort((a, b) => hashStr(path + 'a' + a) - hashStr(path + 'a' + b));
    const orderN = ANCHORS.map((_, i) => i).sort((a, b) => hashStr(path + 'n' + a) - hashStr(path + 'n' + b));
    placedRef.current = orderA.slice(0, count).map((idx, i) => ({
      ast: ASTERISMS[idx],
      ax: ANCHORS[orderN[i % ANCHORS.length]][0],
      ay: ANCHORS[orderN[i % ANCHORS.length]][1],
      scale: 0.15 + (hashStr(path + 's' + i) % 7) / 100,
    }));
  }, [pathname]);

  // Track user activity so the shooting star only appears after a short idle.
  useEffect(() => {
    lastActivityRef.current = Date.now();
    const onActivity = () => { lastActivityRef.current = Date.now(); };
    const evs: (keyof WindowEventMap)[] = ['mousemove', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'];
    evs.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    return () => evs.forEach((e) => window.removeEventListener(e, onActivity));
  }, []);

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
      // Axis-correct parallax. Vertical page scroll drifts stars vertically,
      // EXCEPT inside the home pinned-projects section, where the page's vertical
      // scroll is visually horizontal — there the field drifts horizontally with
      // the cards and its vertical drift is held. Delta accumulation keeps both
      // axes continuous, so the field never jumps when the axis flips.
      const sp = scrollRef.current;
      const now = Date.now();
      const pinActive = parallaxBus.pinActive;

      let dV = sp - prevScrollRef.current;
      prevScrollRef.current = sp;
      if (Math.abs(dV) > 0.15) dV = 0; // ignore route-change / layout teleports

      let dH = parallaxBus.hx - prevHxRef.current;
      prevHxRef.current = parallaxBus.hx;
      if (Math.abs(dH) > 0.5) dH = 0;

      if (pinActive) hAccumRef.current += dH * H_TRAVEL;
      else vAccumRef.current += dV * V_TRAVEL;
      const hAccum = hAccumRef.current;
      const vAccum = vAccumRef.current;

      // The Milky Way band is the deepest layer — it drifts with the field but
      // at a small fraction (slow parallax), so it reads as "further away" than
      // the stars. Centered via translate(-50%,-50%) in markup; we append the
      // drift here without re-centering.
      const milky = milkyRef.current;
      if (milky) {
        milky.style.transform =
          `translate(-50%, -50%) translate(${(-hAccum * 0.03).toFixed(1)}px, ${(-vAccum * 0.03).toFixed(1)}px) rotate(-24deg)`;
      }

      // Scroll velocity (active axis) drives a SUBTLE brightness lift + a short
      // motion trail. The trail is tiny and hard-capped so a fast fling makes a
      // gentle streak, never the screen-filling vertical "rain" the earlier
      // version produced (that bug pinned speed→1 for every star, so every dot
      // became a full line). This is the effect dialled WAY down, not removed.
      const axisDelta = pinActive ? dH * H_TRAVEL : dV * V_TRAVEL;
      velRef.current = velRef.current + (axisDelta - velRef.current) * 0.15;
      const signedVel = velRef.current;
      const speed = Math.min(Math.abs(signedVel) * 0.05, 1); // 0..1 normalised
      const trailDir = signedVel >= 0 ? 1 : -1;

      // Stars use 'screen' on the dark theme so overlapping/parallaxed dots add
      // light (a soft bloom) instead of overwriting; normal blend for light mode.
      ctx.globalCompositeOperation = isDark ? 'screen' : 'source-over';

      starsRef.current?.forEach(s => {
        const xPos = wrapMod(s.x + hAccum * s.parallax, width);
        const yPos = wrapMod(s.y + vAccum * s.parallax, height);
        // Per-star tint on dark; neutral dark dots on light.
        const col = isDark ? s.color : starColor;
        // Only the stars flagged `twinkles` scintillate; the rest hold steady.
        const twinkle = (!s.twinkles || prefersReducedMotion)
          ? 1
          : 0.65 + Math.sin((now * 0.002 * s.twinkle) + s.x) * 0.35;
        // Scroll "wakes" the field: a capped brightness lift while moving.
        const alpha = Math.min(
          s.opacity * twinkle * themeOpacityFactor * (1 + speed * 0.5),
          0.5
        );

        // Short trail along the ACTIVE scroll axis (horizontal while the pin is
        // engaged, vertical otherwise). Scales with speed × the star's parallax
        // depth so only near/fast stars elongate, hard-capped at 12px so even a
        // regression can never bring the "rain" back. Below ~1.5px we draw the
        // calm round dot. Under reduced motion: always a dot.
        const trail = prefersReducedMotion
          ? 0
          : Math.min(speed * s.parallax * 70, 12);

        if (trail > 1.5) {
          ctx.strokeStyle = `rgba(${col}, ${alpha * 0.8})`;
          ctx.lineWidth = s.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(xPos, yPos);
          if (pinActive) ctx.lineTo(xPos - trailDir * trail, yPos);
          else ctx.lineTo(xPos, yPos - trailDir * trail);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${col}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(xPos, yPos, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Constellations: just the steady BRIGHT stars in the asterism shape — no
      // connecting lines — so the real patterns (Big Dipper, Orion, …) read like
      // an actual sky. Drift with the field at a shallow parallax; dark only.
      if (isDark && placedRef.current.length) {
        for (const p of placedRef.current) {
          const base = Math.min(width, height) * p.scale;
          const ox = p.ax * width + hAccum * 0.05;
          const oy = p.ay * height + vAccum * 0.05;
          for (const st of p.ast.stars) {
            const sx = ox + st[0] * base, sy = oy + st[1] * base;
            ctx.fillStyle = 'rgba(190,205,255,0.22)';
            ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      // Idle "shooting star": after ~9s AFK, a meteor streaks across and fades,
      // repeating every few seconds while idle. Any input cancels future ones.
      if (isDark && !prefersReducedMotion) {
        const nowMs = Date.now();
        const idle = nowMs - lastActivityRef.current > 9000;
        if (!meteorRef.current && idle && nowMs - lastMeteorRef.current > 13000) {
          const fromLeft = Math.random() < 0.5;
          const sx = fromLeft ? width * (0.02 + Math.random() * 0.25) : width * (0.73 + Math.random() * 0.25);
          const sy = height * (0.04 + Math.random() * 0.28);
          const sp = Math.max(width, height) * 0.013;
          meteorRef.current = { x: sx, y: sy, vx: (fromLeft ? 1 : -1) * sp * 0.86, vy: sp * 0.5, life: 0, maxLife: 80 };
          lastMeteorRef.current = nowMs;
        }
        const m = meteorRef.current;
        if (m) {
          m.x += m.vx; m.y += m.vy; m.life++;
          const fade = Math.min(1, Math.min(m.life, m.maxLife - m.life) / 12);
          const tailX = m.x - m.vx * 7, tailY = m.y - m.vy * 7;
          const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          g.addColorStop(0, `rgba(255,255,255,${0.85 * fade})`);
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tailX, tailY); ctx.stroke();
          ctx.fillStyle = `rgba(255,255,255,${0.9 * fade})`;
          ctx.beginPath(); ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2); ctx.fill();
          if (m.life >= m.maxLife || m.x < -60 || m.x > width + 60 || m.y > height + 60) meteorRef.current = null;
        }
      }

      ctx.globalCompositeOperation = 'source-over';
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

  // Procedural Milky Way (no image): a soft luminous band with a brighter
  // galactic bulge and a darker central dust rift, built purely from CSS
  // gradients + blur. It only reads on the dark canvas, so light mode omits it.
  const showMilkyWay = resolvedTheme !== 'light';
  return (
    <>
      {showMilkyWay && (
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Procedural galaxy glow — purely soft radial nebulosity (no hard
              rectangle edges, no dark dust-rift line) so it reads as faint
              ambient depth behind content rather than a visible "box with a
              line through it". The draw loop drives its slow parallax via
              milkyRef's transform. */}
          <div
            ref={milkyRef}
            className="absolute left-1/2 top-1/2 h-[200%] w-[150%] will-change-transform"
            style={{ transform: 'translate(-50%, -50%) rotate(-24deg)' }}
          >
            <div className="absolute left-1/2 top-1/2 h-[55%] w-full -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(170,182,255,0.06), transparent 70%)', filter: 'blur(48px)' }} />
            <div className="absolute left-[44%] top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(circle, rgba(255,232,200,0.07), transparent 66%)', filter: 'blur(40px)' }} />
          </div>
        </div>
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      {showMilkyWay && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse 120% 90% at 50% 42%, transparent 52%, rgba(0,0,0,0.5) 100%)' }}
        />
      )}
    </>
  );
};

const PlanetBody = ({ planet, moonRotate = 0, moonEclipse }: { planet: PlanetData, moonRotate?: number, moonEclipse?: { isSolar: boolean, isLunar: boolean } }) => {
 // Single continuous power law on the real diameter ratio (see SIZE_* consts):
 // keeps every planet's TRUE relative size — gas giants properly dominant — while
 // a sub-1 exponent compresses the 11× Jupiter/Earth span enough to fit the hero.
 const finalSize = Math.max(SIZE_FLOOR, Math.pow(planet.diameter / EARTH_DIAMETER_KM, SIZE_EXP) * SIZE_BASE);

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
   {/* Real Sun lighting. The Sun sits at the orbit centre, and because it's the
       orbit RING that rotates, that centre is ALWAYS toward the bottom of each
       planet's local frame — so every planet is lit from below, day-side down,
       night-side up, regardless of where it is on its orbit. */}
   {/* Warm sunlight rim spilling out behind the sun-facing edge ("رده نوری"). */}
   <div
    className="absolute -inset-[28%] rounded-full pointer-events-none"
    style={{ background: 'radial-gradient(circle at 50% 82%, rgba(255,238,210,0.55), transparent 60%)', filter: 'blur(3px)', zIndex: 0 }}
   />
   <div className="w-full h-full rounded-full relative overflow-hidden shadow-2xl pointer-events-none" style={{ background: planet.texture, zIndex: 10 }}>
    {/* day-side specular toward the Sun (bottom) */}
    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 86%, rgba(255,255,255,0.42) 0%, transparent 54%)' }} />
    {/* Night side: a RADIAL shadow growing from the anti-solar (top) point, so the
        terminator curves around the limb like a real lit sphere instead of a flat
        horizontal band. Soft multi-stop falloff keeps the day→night seam gradual. */}
    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 6%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.62) 28%, rgba(0,0,0,0.22) 48%, transparent 64%)' }} />
    {/* faint atmospheric back-scatter on the night limb (rim light) */}
    <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 1px 2px -0.5px rgba(150,170,255,0.18)' }} />
    {/* bright sunlit limb on the bottom edge */}
    <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 -1.5px 2.5px -0.5px rgba(255,247,230,0.6)' }} />
   </div>

   {planet.id === 'earth' && moonEclipse?.isSolar && (
     <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
        {/* A real solar-eclipse shadow seen from space: a soft penumbra ring
            around a dark umbra core, with a thin warm atmospheric limb — not a
            flat black dot. */}
        <div className="absolute w-[44%] h-[44%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.85) 28%, rgba(0,0,0,0.32) 62%, transparent 82%)' }} />
        <div className="absolute w-[16%] h-[16%] rounded-full bg-black/90" style={{ boxShadow: '0 0 4px 1px rgba(255,120,30,0.5)' }} />
     </div>
   )}

   {planet.hasRing && (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[26%] rounded-[50%] rotate-[27deg] pointer-events-none"
     style={{
       // Real ring structure: faint C ring, bright B ring, the dark Cassini
       // division, then the A ring — at Saturn's true ~26.7° axial tilt.
       background: `radial-gradient(ellipse at center, transparent 38%, ${planet.color}22 41%, ${planet.color}55 49%, transparent 56%, transparent 59%, ${planet.color}66 62%, ${planet.color}33 72%, transparent 77%)`,
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
            zIndex: (moonRotate % 360) > 180 ? 30 : 10
        }} 
      />
     </motion.div>
    </div>
   )}
  </motion.div>
 );
};

const Planet = ({ planet, date }: { planet: PlanetData, date: Date }) => {
 const pDist = DIST_OFFSET + Math.pow(planet.au, DIST_EXP) * DIST_K;

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
    // A syzygy is an eclipse only when the Moon is ALSO near the ecliptic
    // (|β| small) — otherwise its shadow misses Earth above/below. Without this
    // every new/full moon falsely eclipses (~25/yr instead of the real 4–7).
    const beta = Math.abs(moonLatitude(date));
    if (distNew < 1 && beta < 1.4) moonEclipse.isSolar = true;
    if (distFull < 1 && beta < 1.0) moonEclipse.isLunar = true;
 }

 // Depth of field: the outer giants read as "further away", so soften them a
 // touch while the inner four stay crisp. Purely cosmetic — never touches the
 // real position/longitude.
 const dof = planet.au > 5 ? Math.min((planet.au - 5) * 0.06, 1.3) : 0;

 return (
  <div className="absolute pointer-events-none" style={{ width: pDist * 2, height: pDist * 2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
   {/* No orbit ring drawn — the planets float on invisible orbits. */}
   <motion.div
    className="absolute inset-0 will-change-transform"
    style={{ rotate: longitudeToScreenAngle(currentAngle), filter: dof ? `blur(${dof}px)` : undefined }}
   >
    <PlanetBody planet={planet} moonRotate={moonRotate} moonEclipse={moonEclipse} />
   </motion.div>
  </div>
 );
};

export default function GlobalUniverse({ renderBackground = false, scrollProgress: externalProgress }: { renderBackground?: boolean, scrollProgress?: number }) {
 const { scrollYProgress } = useScroll();
 const [progress, setProgress] = useState(0);
 const prefersReducedMotion = usePrefersReducedMotion();

 // Update on every scroll change so the orbits turn smoothly with the scroll.
 // (An earlier delta-throttle here made slow scrolling step/freeze the planets.)
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
 // Linear scroll→time mapping: the hero only occupies a small slice of total
 // page scroll, so any easing curve (e.g. cubic) collapses that slice to almost
 // no motion and the orbits look frozen. Linear keeps them visibly turning as
 // you scroll through the hero.
 const date = now
   ? new Date(now.getTime() + (prefersReducedMotion ? 0 : activeProgress * SCROLL_TIME_SPAN_MS))
   : null;

 return (
  <div className="absolute inset-0 pointer-events-none z-[50]">
   <div className="absolute inset-0 flex items-center justify-center">
    {/* Scale the whole system down on small heroes so the outer planets (the
        Neptune orbit is ~1000px) don't clip out of a 280px mobile box. */}
    <div className="relative w-full h-full scale-[0.42] sm:scale-[0.62] md:scale-90 lg:scale-100">
     <motion.div
      id="sun-element"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ width: SUN_SIZE, height: SUN_SIZE }}
     >
      {/* Layered corona: a wide warm bleed into the void → mid amber → tight
          white-hot core. Insets scale off SUN_SIZE so the glow keeps its shape
          when the core is resized. The outer corona breathes by SCALE (not
          opacity) so it reads as a living star, not a blinking dot. */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: -SUN_SIZE * 2, background: 'radial-gradient(circle, rgba(255,170,60,0.18) 0%, rgba(255,120,20,0.07) 38%, transparent 70%)' }}
        animate={prefersReducedMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
        transition={prefersReducedMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute rounded-full" style={{ inset: -SUN_SIZE * 0.98, background: 'radial-gradient(circle, rgba(255,200,90,0.28) 0%, rgba(255,150,40,0.12) 45%, transparent 72%)', filter: 'blur(8px)' }} />
      <div className="absolute rounded-full" style={{ inset: -SUN_SIZE * 0.31, background: 'radial-gradient(circle, rgba(255,230,150,0.55) 0%, transparent 70%)', filter: 'blur(4px)' }} />
      <div className="absolute inset-0 rounded-full bg-[#FFD700]" style={{ boxShadow: `0 0 ${SUN_SIZE}px rgba(255,165,0,0.7)` }} />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_30%,#FFFFFF_0%,#FFE680_28%,#FFC107_55%,#FF8C00_100%)]" />
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,transparent_70%)] opacity-50" />
     </motion.div>
     {date && PLANETS_DATA.map((planet) => (
      <Planet
        key={planet.id}
        planet={planet}
        date={date}
      />
     ))}
    </div>
   </div>
  </div>
 );
}