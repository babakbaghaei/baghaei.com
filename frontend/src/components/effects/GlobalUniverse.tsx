'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useTheme } from 'next-themes';
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

// ── Display scaling — "exact top-down orrery, corner Sun" ───────────────────
// PURELY VISUAL. None of these touch the ephemeris/longitude math below, so the
// live longitudes, eclipses and Moon phase stay exact. A TOP-DOWN view with the
// Sun in the top-left corner; planets orbit it on concentric circles at their
// EXACT real diameter ratios and EXACT real AU distance ratios, placed by each
// planet's LIVE heliocentric longitude. Because true scale is enormous (Neptune
// is 77× Mercury's distance) and the Sun sits in the corner, only the lower-right
// quadrant shows: the inner worlds cluster by the Sun, the giants are usually
// off-frame and rotate into view as their live longitude (or a scroll) brings
// them round. Retune the look by editing these numbers only.
const EARTH_DIAMETER_KM = 12756;

// EXACT sizes: on-screen diameter is TRUE-linear in real diameter (size =
// diameter/Earth × sizeBase), so Jupiter really is ~11× Earth and Mercury ~0.38×.
// Multiplied by the responsive factor `k` at render so the whole system scales
// with the viewport. A tiny floor keeps Mercury/Mars from vanishing sub-pixel.
const SIZE_FLOOR = 3;    // smallest visual size (px) so the tiniest worlds never vanish

// EXACT distance scale. Orbit radius is TRUE-linear in AU (no compression):
// radius = (au / Neptune_au) × distSpan × frameDiagonal. So every spacing is the
// real heliocentric ratio — Mercury 0.39 AU sits ~1.3% of the way out, Neptune
// 30 AU at the far reach — exactly as in the real solar system. Anchored to the
// corner Sun, so only the lower-right quadrant of each orbit is in view.
const NEPTUNE_AU = 30.06; // outermost real distance — anchors the radial scale

// ── Tunable display scale ────────────────────────────────────────────────────
// These five numbers are the ONLY visual knobs (the live ephemeris/longitude
// math is untouched, so positions/eclipses/phase stay exact). They can be
// overridden at runtime via the `scale` prop — that is what the dev panel
// drives. `zoom` is a master multiplier applied to BOTH the sizes and the orbit
// distances, so the whole system grows/shrinks around the corner Sun while every
// ratio stays exact. The remaining knobs are the per-axis fine tunes. The type +
// defaults live in ./solarScale so Hero/the dev panel can import them without
// pulling in this heavy (lazy-loaded) module.
export { DEFAULT_SCALE } from './solarScale';
export type { SolarScale } from './solarScale';
import { DEFAULT_SCALE, type SolarScale } from './solarScale';

// Each planet rides a CONCENTRIC CIRCULAR ORBIT centred on the Sun. Its on-screen
// angle is its REAL heliocentric longitude, 1:1 (no compression), so the planets'
// relative configuration is astronomically exact. Scrolling fast-forwards time, so
// each body sweeps its orbit at its true rate: Mercury laps many times, Neptune
// barely crawls. The outer giants' orbits run off-frame — only their in-view arc
// shows, which is what a top-down map seen through a window does.
// Axial spin period (s) per planet — giants whirl fast, the inner worlds turn
// slow, matching the real qualitative ordering. The surface scrolls under the
// fixed terminator, so the lit side never moves while the planet visibly turns.
const SPIN_SECONDS: Record<string, number> = {
  mercury: 58, venus: 64, earth: 26, mars: 26, jupiter: 14, saturn: 15, uranus: 22, neptune: 20,
};

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
// FIXED site-wide placement: the SAME asterisms sit at the SAME principled
// anchors on every route — the sky no longer regenerates as you navigate. Each
// is spread around the frame and kept clear of the dead centre where headlines
// sit. (ax, ay) are viewport fractions; `scale` sizes the asterism's own box.
const PLACED_CONSTELLATIONS: { ast: Asterism; ax: number; ay: number; scale: number }[] = [
  { ast: ASTERISMS[0], ax: 0.07, ay: 0.11, scale: 0.22 }, // دب اکبر — top-leading
  { ast: ASTERISMS[2], ax: 0.75, ay: 0.09, scale: 0.17 }, // ذات‌الکرسی — top-trailing
  { ast: ASTERISMS[1], ax: 0.83, ay: 0.44, scale: 0.20 }, // جبار — mid-trailing
  { ast: ASTERISMS[4], ax: 0.09, ay: 0.67, scale: 0.20 }, // عقرب — lower-leading
  { ast: ASTERISMS[6], ax: 0.66, ay: 0.80, scale: 0.20 }, // اسد — lower-trailing
];

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
  // Idle "shooting star" bookkeeping (constellations are fixed site-wide).
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
      if (isDark) {
        for (const p of PLACED_CONSTELLATIONS) {
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

// ── Per-planet surfaces ───────────────────────────────────────────────────────
// MINIMAL: each planet is a single clean shaded sphere — one radial gradient
// (light core → base hue → dark rim) that reads as a small smooth ball. No
// craters, spots, belts or cloud streaks; the sphere lighting (specular toward
// the Sun + curved night terminator) is applied separately in PlanetBody, so
// these bases stay flat and uncluttered. Attractive and uniform across the set.
const SURFACE: Record<string, string> = {
  mercury: 'radial-gradient(circle at 50% 42%, #c2c2c2, #8a8a8a 56%, #4a4a4a 100%)',
  venus:   'radial-gradient(circle at 50% 42%, #f4e4b4, #cfa45e 56%, #8a6a30 100%)',
  earth:   'radial-gradient(circle at 50% 42%, #5aa6e6, #2470b4 56%, #123a6b 100%)',
  mars:    'radial-gradient(circle at 50% 42%, #e8915f, #bd5d31 56%, #6d2c16 100%)',
  jupiter: 'radial-gradient(circle at 50% 42%, #e7cda4, #c0986a 56%, #835f3c 100%)',
  saturn:  'radial-gradient(circle at 50% 42%, #ecdcab, #c2a667 56%, #87703a 100%)',
  uranus:  'radial-gradient(circle at 50% 42%, #d6f3f0, #92d2d6 56%, #4f969f 100%)',
  neptune: 'radial-gradient(circle at 50% 42%, #6f8bff, #2f4fc9 56%, #142468 100%)',
};

// On-screen orbital radius (px) from the corner Sun — TRUE-linear in AU, so the
// spacing is the exact real heliocentric ratio. Shared by each planet and its
// drawn orbit ring so body and ring always coincide. `distSpan × zoom` is the
// only place the master zoom touches distance; ratios stay exact.
const orbitRadius = (au: number, diag: number, distSpan: number, zoom: number) =>
  (au / NEPTUNE_AU) * distSpan * zoom * diag;

// Earth's live Moon geometry (shared by the fan + the focused view).
const earthMoon = (date: Date) => {
  // Elongation of the Moon from the Sun: 0° = new moon, 180° = full moon.
  const elongation = norm360(moonLongitude(date) - sunLongitude(date));
  const moonRotate = norm360(180 - elongation);
  const distNew = Math.min(elongation, 360 - elongation);
  const distFull = Math.abs(elongation - 180);
  // A syzygy is an eclipse only when the Moon is ALSO near the ecliptic
  // (|β| small) — otherwise its shadow misses Earth above/below.
  const beta = Math.abs(moonLatitude(date));
  return { elongation, moonRotate, isSolar: distNew < 1 && beta < 1.4, isLunar: distFull < 1 && beta < 1.0 };
};

interface Frame { W: number; H: number; k: number; scale: SolarScale; }

// A lit sphere illuminated from screen-direction `sunDirDeg` (degrees, measured
// from +x toward +y/down, pointing AT the Sun). Reused by the fan and the
// focused view; `spin` scrolls the surface bands in the big focused view.
const PlanetBody = ({ planet, size, sunDirDeg, moonRotate = 0, moonEclipse, spin = false, spinSeconds = 30 }: { planet: PlanetData; size: number; sunDirDeg: number; moonRotate?: number; moonEclipse?: { isSolar: boolean; isLunar: boolean }; spin?: boolean; spinSeconds?: number }) => {
  const c = Math.cos(sunDirDeg * DEG);
  const s = Math.sin(sunDirDeg * DEG);
  // Sunward unit vector (c,s) points AT the Sun. The sub-solar point is the
  // bright centre of the day hemisphere; the anti-solar point seeds the night
  // side, so the terminator curves around the limb like a real lit sphere. Night
  // is taken nearly to black — in space the unlit side vanishes against the dark,
  // leaving the planet as a sunlit phase (crescent→gibbous): the most physical look.
  const lx = 50 + 38 * c, ly = 50 + 38 * s;   // sub-solar (toward Sun)
  const nx = 50 - 50 * c, ny = 50 - 50 * s;   // anti-solar (night seed)
  const hasAtmo = planet.id === 'earth' || planet.id === 'venus' || planet.id === 'neptune' || planet.id === 'uranus';
  // Moon: real SIZE ratio (0.272× Earth's diameter). Its real DISTANCE (30.1
  // Earth-diameters) can't be shown to scale — Earth is drawn ~19× oversized vs
  // its true AU orbit, so a to-scale Moon would sit beyond the Sun. So, as every
  // orrery does, the Moon hugs Earth (orbit box ≈ 2.6× Earth) — clearly Earth's
  // moon, far nearer than the Sun. (radius = box/2; the dot sits at the top edge.)
  // Moon geometry. The orbit can't be shown to scale (see note above), so the
  // Moon hugs Earth at ~1.3× Earth-radius. We place it by absolute offset (not a
  // rotated arm) so its z-index can interleave with the globe: on the FAR arc it
  // is occluded by Earth, on the NEAR arc it crosses in front.
  const moonDot = Math.max(2, size * 0.3);
  const mTheta = moonRotate * DEG;             // 0 = top (far side), 180 = bottom (near)
  const mR = size * 1.3;                        // Moon orbit radius in px
  const mX = mR * Math.sin(mTheta);
  const mY = -mR * Math.cos(mTheta);
  const moonFront = Math.cos(mTheta) <= 0;      // near half (lower screen) → in front of Earth

  // Saturn's rings, split into a FAR half (clipped to the top, drawn behind the
  // globe so the opaque disc occludes the arc that runs behind the planet) and a
  // NEAR half (clipped to the bottom, drawn in front, crossing the near limb).
  // Both halves render beyond the limb where nothing occludes, so the ring tips
  // join seamlessly — only the part crossing the disc is split by depth.
  const ringBg = `radial-gradient(ellipse at center, transparent 38%, ${planet.color}22 41%, ${planet.color}55 49%, transparent 56%, transparent 59%, ${planet.color}66 62%, ${planet.color}33 72%, transparent 77%)`;
  const ringClass = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[26%] rounded-[50%] rotate-[27deg] pointer-events-none';

  return (
    <div className="relative rounded-full" style={{ width: size, height: size }}>
      {/* Atmospheric limb glow — a sunlit halo of air just OUTSIDE the disc on the
          sunward side (Rayleigh forward-scatter), so lit atmospheres read as a
          luminous blue rim against space. Behind the globe so only the rim shows. */}
      {hasAtmo && (
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `${(2.6 * c).toFixed(2)}px ${(2.6 * s).toFixed(2)}px ${Math.max(3, size * 0.12).toFixed(1)}px 0px rgba(140,185,255,0.5)`, zIndex: 0 }} />
      )}

      {/* FAR ring half — behind the globe. Clipped to the top half along the ring's
          major axis; the opaque disc hides it, so only the arc beyond the limb shows. */}
      {planet.hasRing && (
        <div className={ringClass} style={{ background: ringBg, clipPath: 'inset(0 0 50% 0)', zIndex: 1 }} />
      )}

      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full shadow-2xl"
        style={{ background: SURFACE[planet.id] || planet.texture, backgroundSize: spin ? '220% 100%' : 'cover', zIndex: 2 }}
        animate={spin ? { backgroundPositionX: ['0%', '-220%'] } : undefined}
        transition={spin ? { duration: spinSeconds, repeat: Infinity, ease: 'linear' } : undefined}
      >
        {/* Day hemisphere — sunlight wash from the sub-solar point, Lambertian
            falloff to the terminator. Sunlight ≈ 5800K: near-white, faintly warm. */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,252,245,0.55) 0%, rgba(255,250,242,0.18) 30%, rgba(255,250,242,0.04) 50%, transparent 64%)` }} />
        {/* Specular sun-glint — a tight hotspot only on ocean/cloud worlds. */}
        {hasAtmo && (
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.12) 12%, transparent 22%)` }} />
        )}
        {/* Night hemisphere + curved terminator — taken almost to black so the
            unlit side dissolves into space and the planet reads as a phase. */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${nx}% ${ny}%, rgba(0,0,0,0.99) 0%, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.15) 62%, transparent 72%)` }} />
        {/* Limb darkening — soft inset rim shadow so the lit disc keeps its sphere
            volume (edges fall away from the viewer) instead of reading flat. */}
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: `inset 0 0 ${(size * 0.16).toFixed(1)}px ${(size * 0.05).toFixed(1)}px rgba(0,0,0,0.45)` }} />
      </motion.div>
      {/* Atmospheric scattering — a cool blue twilight band on the sunward limb
          (Rayleigh back-scatter), only worlds with real atmospheres. */}
      {hasAtmo && (
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `inset ${(2.2 * c).toFixed(2)}px ${(2.2 * s).toFixed(2)}px 5px -1px rgba(150,190,255,0.55)`, zIndex: 3 }} />
      )}
      {/* Bright sunlit crescent on the limb facing the Sun — the specular edge of
          the lit hemisphere; warm-white, thin, the planet's brightest line. */}
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `inset ${(1.7 * c).toFixed(2)}px ${(1.7 * s).toFixed(2)}px 2.5px -0.5px rgba(255,248,233,0.7)`, zIndex: 3 }} />

      {/* NEAR ring half — in front of the globe, crossing the near (lower) limb. */}
      {planet.hasRing && (
        <div className={ringClass} style={{ background: ringBg, clipPath: 'inset(50% 0 0 0)', zIndex: 4 }} />
      )}

      {planet.id === 'earth' && moonEclipse?.isSolar && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="absolute w-[44%] h-[44%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.85) 28%, rgba(0,0,0,0.32) 62%, transparent 82%)' }} />
          <div className="absolute w-[16%] h-[16%] rounded-full bg-black/90" style={{ boxShadow: '0 0 4px 1px rgba(255,120,30,0.5)' }} />
        </div>
      )}

      {/* The Moon — a small shaded sphere lit from the same Sun direction as the
          globe, so it shows a real terminator. zIndex flips around the orbit so it
          is occluded by Earth on the far arc and in front on the near arc. In a
          lunar eclipse (خسوف) it dims to eclipse copper; otherwise pale grey. */}
      {planet.hasMoon && (
        <div className="absolute rounded-full overflow-hidden pointer-events-none"
          style={{ width: moonDot, height: moonDot, left: `calc(50% + ${mX.toFixed(2)}px)`, top: `calc(50% + ${mY.toFixed(2)}px)`, transform: 'translate(-50%, -50%)', zIndex: moonFront ? 5 : 1, boxShadow: moonEclipse?.isLunar ? '0 0 6px 1px rgba(200,80,45,0.7)' : (moonFront ? '0 0 3px rgba(255,255,255,0.6)' : 'none') }}
        >
          <div className="absolute inset-0 rounded-full transition-colors duration-500" style={{ background: moonEclipse?.isLunar ? 'radial-gradient(circle at 50% 42%, #c2592f, #7c2d16 58%, #341208 100%)' : 'radial-gradient(circle at 50% 42%, #eaeaed, #a3a8af 58%, #4b4f55 100%)' }} />
          {!moonEclipse?.isLunar && (
            <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,255,255,0.55) 0%, transparent 58%)` }} />
          )}
          <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at ${nx}% ${ny}%, rgba(0,0,0,0.96) 26%, rgba(0,0,0,0.5) 52%, transparent 74%)` }} />
        </div>
      )}
    </div>
  );
};

// One planet on its CONCENTRIC ORBIT around the corner Sun. An arm pivots at the
// Sun and is rotated to the planet's orbital angle (its real heliocentric
// longitude); the planet rides the arm at its real-ratio radius. Scrolling
// advances time → the longitude advances at the planet's true rate → the body
// sweeps its orbit around the Sun (inner worlds fast, giants slow). Because the
// Sun is the pivot, the planet is always lit from the inner end (local 180°), so
// the sphere lighting never needs recomputing. Purely decorative (no interaction).
const Planet = ({ planet, date, frame, reduced, boost, onBoost, onDragStart, onDragEnd }: { planet: PlanetData; date: Date; frame: Frame; reduced: boolean; boost: number; onBoost: (id: string, delta: number) => void; onDragStart: (id: string) => void; onDragEnd: (id: string) => void }) => {
  const { sizeBase, distSpan, zoom, sunCx, sunCy, sizeExp } = frame.scale;
  const size = Math.max(SIZE_FLOOR, Math.pow(planet.diameter / EARTH_DIAMETER_KM, sizeExp) * sizeBase * zoom) * frame.k;
  // Base orbit radius, then the live drag-boost grows/shrinks the axis. boost is
  // a fraction (−0.5..1.2) accumulated by the heavily-damped radial drag below.
  const r = orbitRadius(planet.au, Math.hypot(frame.W, frame.H), distSpan, zoom) * (1 + boost);

  // Dragging is intentionally VERY stiff: a radial drag barely nudges the orbit.
  // Pointer delta is projected onto the planet's outward direction and scaled by
  // a tiny factor, so you have to haul a long way to move it even a little — and
  // the orbit "axis" (radius, drawn ring included) grows/shrinks as you pull.
  const dragging = useRef(false);
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    const a = norm360(-planetLongitude(planet.id, date)) * DEG; // outward screen dir
    dirRef.current = { x: Math.cos(a), y: Math.sin(a) };
    onDragStart(planet.id);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const d = dirRef.current;
    const radial = d.x * e.movementX + d.y * e.movementY; // px along outward axis
    onBoost(planet.id, radial * 0.0006); // heavy resistance
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    onDragEnd(planet.id); // release → magnetic spring back to origin
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };
  // Orbital angle = real heliocentric longitude, 1:1 around the Sun, so
  // the planets' relative configuration is astronomically exact. The arm puts the
  // planet at local +x, so screen angle = −longitude gives the real prograde
  // sense (view from the north). STATIC transform (so the per-minute clock tick
  // can't restart the spin / idle-sway animations nested below); the
  // scroll-advanced date is what makes it move.
  const restAngle = norm360(-planetLongitude(planet.id, date));

  const sx = sunCx * frame.W, sy = sunCy * frame.H; // orbit centre = Sun

  const m = planet.id === 'earth' ? earthMoon(date) : null;
  const moonEclipse = { isSolar: m?.isSolar ?? false, isLunar: m?.isLunar ?? false };

  return (
    <div className="absolute" style={{ left: sx, top: sy, width: 0, height: 0, zIndex: 2 }}>
      {/* Orbital angle (real longitude → visible quadrant). The body holds this
          scroll-derived angle EXACTLY at rest — no idle sway — so the system is
          perfectly still when the user is not scrolling. Revolution comes solely
          from the scroll-advanced date feeding restAngle. */}
      <div style={{ transformOrigin: '0px 0px', transform: `rotate(${restAngle}deg)` }}>
        {/* Planet centred on its orbit at distance r; lit from the Sun (local 180°).
            pointer-events-auto so this disc is the one draggable bit of the field. */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: r, top: 0, pointerEvents: 'auto', cursor: 'grab', touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <PlanetBody planet={planet} size={size} sunDirDeg={180} moonRotate={m?.moonRotate ?? 0} moonEclipse={moonEclipse} spin={!reduced} spinSeconds={SPIN_SECONDS[planet.id] ?? 30} />
        </div>
      </div>
    </div>
  );
};

// The Sun: a natural warm-white star (white-hot core → warm amber halo, not a
// flat gold disc), anchored in the top-left corner (the centre of the orbits).
const Sun = ({ frame, reduced }: { frame: Frame; reduced: boolean }) => {
  const { sunSize, zoom, sunCx, sunCy, sunGlow, sunOpacity } = frame.scale;
  const d = sunSize * zoom * frame.k;
  // `g` scales the halo SPREAD (inset of each glow layer); a gentle brightness
  // filter rides the same knob so more glow also reads brighter, 0 = bare disc.
  const g = sunGlow;
  return (
    <motion.div className="absolute" style={{ left: sunCx * frame.W, top: sunCy * frame.H, width: d, height: d, transform: 'translate(-50%, -50%)', opacity: sunOpacity, filter: `brightness(${(0.7 + 0.3 * g).toFixed(2)})` }}>
      <motion.div className="absolute rounded-full" style={{ inset: -d * 0.85 * g, background: 'radial-gradient(circle, rgba(255,214,150,0.14) 0%, rgba(255,160,70,0.06) 42%, transparent 70%)' }}
        animate={reduced ? undefined : { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={reduced ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute rounded-full" style={{ inset: -d * 0.4 * g, background: 'radial-gradient(circle, rgba(255,228,180,0.3) 0%, rgba(255,180,90,0.1) 48%, transparent 72%)', filter: 'blur(6px)' }} />
      <div className="absolute rounded-full" style={{ inset: -d * 0.16 * g, background: 'radial-gradient(circle, rgba(255,246,224,0.55) 0%, transparent 70%)', filter: 'blur(3px)' }} />
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fff6e0 16%, #ffe2a6 40%, #ffc266 66%, #ff9d3c 100%)', boxShadow: `0 0 ${d * 0.35 * g}px rgba(255,190,110,0.65)` }} />
      <div className="absolute inset-[14%] rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, transparent 72%)', opacity: 0.55 }} />
    </motion.div>
  );
};

export default function GlobalUniverse({ renderBackground = false, scrollProgress: externalProgress, scale }: { renderBackground?: boolean, scrollProgress?: number, scale?: Partial<SolarScale> }) {
 const { scrollYProgress } = useScroll();
 const [progress, setProgress] = useState(0);
 const prefersReducedMotion = usePrefersReducedMotion();

 // Per-planet orbit-radius boost, accumulated by the heavily-damped planet drag.
 // Clamped so a body can't be hauled into the Sun or off to infinity. On release
 // it eases back to 0 — the planet snaps magnetically to its real orbit.
 const [orbitBoost, setOrbitBoost] = useState<Record<string, number>>({});
 const boostRef = useRef<Record<string, number>>({});   // synchronous mirror of state
 const velRef = useRef<Record<string, number>>({});      // per-planet spring velocity
 const draggingRef = useRef<Set<string>>(new Set());
 const decayRafRef = useRef(0);
 // STRETCH_LIMIT is the asymptote; pulling resistance climbs as |boost| nears it
 // (the more stretched, the less each pixel stretches it — no hard wall to hit).
 const STRETCH_LIMIT = 1.0;
 const handleBoost = (id: string, delta: number) => {
   const cur = boostRef.current[id] ?? 0;
   // Progressive resistance: gain fades toward 0 as the stretch approaches the
   // limit, so it asymptotes smoothly instead of slamming into a clamp.
   const give = Math.max(0, 1 - Math.abs(cur) / STRETCH_LIMIT);
   const v = cur + delta * give;
   boostRef.current = { ...boostRef.current, [id]: v };
   velRef.current = { ...velRef.current, [id]: delta * give }; // momentum into the spring
   setOrbitBoost(boostRef.current);
 };
 const startDecay = () => {
   if (decayRafRef.current) return;
   // Underdamped spring pulling each boost back to 0: a = −k·x − c·v. Carries the
   // release momentum, settles with a tiny bounce, never stops abruptly mid-air.
   const K = 0.07, C = 0.2;
   const step = () => {
     const next: Record<string, number> = { ...boostRef.current };
     const vel: Record<string, number> = { ...velRef.current };
     let alive = false;
     for (const id in next) {
       if (draggingRef.current.has(id)) { alive = true; continue; }
       const x = next[id];
       let v = (vel[id] ?? 0) + (-K * x - C * (vel[id] ?? 0));
       const nx = x + v;
       if (Math.abs(nx) < 0.0004 && Math.abs(v) < 0.0004) { next[id] = 0; v = 0; }
       else { next[id] = nx; alive = true; }
       vel[id] = v;
     }
     boostRef.current = next;
     velRef.current = vel;
     setOrbitBoost(next);
     decayRafRef.current = alive ? requestAnimationFrame(step) : 0;
   };
   decayRafRef.current = requestAnimationFrame(step);
 };
 const handleDragStart = (id: string) => { draggingRef.current.add(id); velRef.current = { ...velRef.current, [id]: 0 }; };
 const handleDragEnd = (id: string) => { draggingRef.current.delete(id); startDecay(); };
 useEffect(() => () => { if (decayRafRef.current) cancelAnimationFrame(decayRafRef.current); }, []);

 // Update on every scroll change so the system advances smoothly with scroll.
 useEffect(() => {
    return scrollYProgress.on('change', (v) => setProgress(v));
 }, [scrollYProgress]);

 const activeProgress = externalProgress !== undefined ? externalProgress : progress;

 // Live clock for the foreground solar system. Planets are positioned from the
 // real current date, refreshed every minute so the view stays accurate.
 const [now, setNow] = useState<Date | null>(null);
 useEffect(() => {
    const tick = () => setNow(new Date());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 60000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
 }, []);

 // The Sun + the orbits are positioned as fractions of the hero box, so we
 // measure its live pixel size. Until it's known we render no Sun/planets.
 const frameRef = useRef<HTMLDivElement>(null);
 const [size, setSize] = useState<{ W: number; H: number } | null>(null);
 useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setSize({ W: el.clientWidth, H: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
 }, []);

 if (renderBackground) {
    // Observe the canvas so the starfield rAF loop pauses whenever it is
    // scrolled out of the viewport.
    return <GalaxyBackground scrollProgress={activeProgress} observeVisibility />;
 }

 // Avoid a server/client hydration mismatch: render nothing until the
 // client-side clock is set. The base is the real "now" (live); scrolling
 // fast-forwards simulated time so the fan visibly advances. Under reduced
 // motion we anchor to "now" only (no scroll-advance).
 const date = now
   ? new Date(now.getTime() + (prefersReducedMotion ? 0 : activeProgress * SCROLL_TIME_SPAN_MS))
   : null;

 // Merge any runtime overrides (dev panel) onto the locked defaults.
 const activeScale: SolarScale = { ...DEFAULT_SCALE, ...scale };

 const frame: Frame | null = size
   ? { W: size.W, H: size.H, k: Math.max(0.5, Math.min(1.15, Math.hypot(size.W, size.H) / 1600)), scale: activeScale }
   : null;

 return (
  <div ref={frameRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[50]">
   {/* Warm light scattering from the corner Sun across the field. */}
   <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(75% 75% at ${activeScale.sunCx * 100}% ${activeScale.sunCy * 100}%, rgba(255,206,140,${(0.10 * activeScale.ambientGlow).toFixed(3)}) 0%, rgba(255,168,82,${(0.05 * activeScale.ambientGlow).toFixed(3)}) 30%, transparent 64%)` }} />
   {frame && (
    <>
     {/* Faint concentric orbit rings centred on the Sun — make the real circular
         orbits explicit; the outer ones run off-frame and only their in-view arc shows. */}
     {PLANETS_DATA.map((planet) => {
       const rr = orbitRadius(planet.au, Math.hypot(frame.W, frame.H), activeScale.distSpan, activeScale.zoom) * (1 + (orbitBoost[planet.id] ?? 0));
       return (
         <div key={`ring-${planet.id}`} aria-hidden className="absolute rounded-full"
           style={{ left: activeScale.sunCx * frame.W, top: activeScale.sunCy * frame.H, width: rr * 2, height: rr * 2, transform: 'translate(-50%, -50%)', border: `1px solid rgba(255,255,255,${activeScale.orbitOpacity})` }} />
       );
     })}
     <Sun frame={frame} reduced={prefersReducedMotion} />
     {date && PLANETS_DATA.map((planet) => (
      <Planet key={planet.id} planet={planet} date={date} frame={frame} reduced={prefersReducedMotion} boost={orbitBoost[planet.id] ?? 0} onBoost={handleBoost} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
     ))}
    </>
   )}
  </div>
 );
}