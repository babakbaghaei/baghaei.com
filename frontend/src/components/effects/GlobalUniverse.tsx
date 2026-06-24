'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
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

// ── Display scaling — "corner star, real-ratio fan" ─────────────────────────
// PURELY VISUAL. None of these touch the ephemeris/longitude math below, so the
// live longitudes, eclipses and Moon phase stay exact. The Sun is anchored just
// off the TOP-LEFT corner (a dominant light source, partly out of frame); the
// planets fan DOWN-RIGHT from it along a diagonal at their REAL relative sizes
// and distances. Every planet is lit from the corner and casts a long dusty
// shadow cone toward the bottom-right — the "obstacle in front of a light in a
// dusty night" look the brief asked for. Retune by editing these numbers only.
const EARTH_DIAMETER_KM = 12756;

// Sizes: real diameter ratio, gently compressed so the giants dominate without
// swallowing the frame and the inner worlds stay clickable. Multiplied by the
// responsive factor `k` at render so the whole system scales with the viewport.
const SIZE_EXP = 0.90;   // 1 = true diameter ratios; ~0.9 lets the giants truly dominate
const SIZE_BASE = 13;    // Earth's on-screen diameter (px) at full scale
const SIZE_FLOOR = 8;    // smallest visual size (px); the hit area is padded separately
const HIT_MIN = 26;      // minimum clickable target (px) for the tiny inner worlds

// Distances along the diagonal from the corner Sun, as a fraction of the frame
// diagonal. Real AU compressed by a power law: the four inner worlds cluster
// near the Sun and the giants spread far out — the real proportional layout.
const DIST_EXP = 0.60;   // 1 = true linear AU; <1 pulls the outer giants inward
const DIST_NEAR = 0.15;  // Mercury's distance from the Sun (fraction of diagonal)
const DIST_FAR = 0.99;   // Neptune's distance (fraction of diagonal)

// The Sun: a huge corner light. Its center sits just off the top-left corner.
const SUN_SIZE = 440;    // Sun core diameter (px) at full scale
const SUN_CX = -0.05;    // Sun center X as a fraction of frame width  (off-frame)
const SUN_CY = -0.09;    // Sun center Y as a fraction of frame height (off-frame)

// The diagonal the planets fan along, measured from +x (right) toward +y (down).
const FAN_ANGLE_DEG = 42;   // base diagonal direction toward the bottom-right
const FAN_SPREAD_DEG = 8;   // static per-planet spread so they don't sit on one line
const FAN_SWAY_DEG = 6;     // live longitude offsets each planet's resting angle ±this
const ORBIT_SWAY_DEG = 7;   // slow orbital oscillation amplitude around the resting angle

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

// Persian Moon-phase name from the Sun–Moon elongation (0°=new … 180°=full).
// Shown live in the focused-planet view for Earth.
const moonPhaseName = (elongation: number) => {
  const e = norm360(elongation);
  if (e < 22.5 || e >= 337.5) return 'ماه نو';
  if (e < 67.5) return 'هلال نو';
  if (e < 112.5) return 'تربیع اول';
  if (e < 157.5) return 'احدب فزاینده';
  if (e < 202.5) return 'بدر';
  if (e < 247.5) return 'احدب کاهنده';
  if (e < 292.5) return 'تربیع آخر';
  return 'هلال کهنه';
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
// Layered CSS gradients give the now real-ratio-sized planets genuine surface
// detail (bands, spots, polar caps, clouds) with zero image assets. Listed
// top→bottom: detail layers first, base sphere colour last.
const SURFACE: Record<string, string> = {
  mercury:
    'radial-gradient(circle at 62% 60%, rgba(0,0,0,0.42) 0 4%, rgba(0,0,0,0.18) 5%, transparent 8%),' +   // craters
    'radial-gradient(circle at 40% 72%, rgba(0,0,0,0.34) 0 3%, transparent 6%),' +
    'radial-gradient(circle at 28% 44%, rgba(0,0,0,0.3) 0 3%, transparent 5%),' +
    'radial-gradient(circle at 74% 38%, rgba(255,255,255,0.14) 0 3%, transparent 5%),' +                  // ray
    'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 8%, transparent 8% 16%),' +                      // rotation cue
    'radial-gradient(circle at 34% 32%, #c6c6c6, #707070 55%, #393939 100%)',
  venus:
    'repeating-linear-gradient(112deg, rgba(255,255,255,0.10) 0 6px, transparent 6px 15px),' +            // swirled clouds
    'radial-gradient(ellipse 32% 18% at 40% 34%, rgba(255,242,205,0.32) 0 60%, transparent 76%),' +
    'radial-gradient(circle at 36% 30%, #f6e2ac, #d8ad5f 58%, #9b7331 100%)',
  earth:
    'radial-gradient(ellipse 22% 15% at 31% 60%, rgba(34,120,60,0.95) 0 58%, transparent 72%),' +         // landmass
    'radial-gradient(ellipse 17% 21% at 63% 41%, rgba(40,132,72,0.92) 0 56%, transparent 72%),' +         // landmass
    'radial-gradient(ellipse 10% 8% at 71% 73%, rgba(40,124,68,0.85) 0 58%, transparent 74%),' +          // island
    'radial-gradient(circle at 50% 11%, rgba(255,255,255,0.72) 0 7%, transparent 12%),' +                 // ice cap
    'radial-gradient(ellipse 20% 6% at 44% 80%, rgba(255,255,255,0.5) 0 48%, transparent 76%),' +         // cloud band
    'radial-gradient(ellipse 15% 5% at 66% 26%, rgba(255,255,255,0.45) 0 48%, transparent 78%),' +        // cloud
    'radial-gradient(circle at 33% 30%, #5aa6e6, #2470b4 55%, #123a6b 100%)',                             // ocean
  mars:
    'radial-gradient(circle at 50% 11%, rgba(255,255,255,0.85) 0 6%, rgba(255,255,255,0.3) 9%, transparent 13%),' + // N polar cap
    'radial-gradient(circle at 50% 92%, rgba(255,255,255,0.7) 0 5%, transparent 9%),' +                   // S polar cap
    'radial-gradient(ellipse 18% 13% at 63% 55%, rgba(80,30,15,0.45) 0 60%, transparent 74%),' +          // maria
    'radial-gradient(ellipse 12% 9% at 33% 62%, rgba(92,40,20,0.4) 0 58%, transparent 74%),' +
    'radial-gradient(circle at 71% 34%, rgba(0,0,0,0.28) 0 3%, transparent 5%),' +                        // crater
    'repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 9%, transparent 9% 18%),' +                      // rotation cue
    'radial-gradient(circle at 34% 30%, #e8915f, #b9572e 55%, #6d2c16 100%)',
  jupiter:
    'radial-gradient(ellipse 17% 12% at 64% 62%, #d4502f 0 58%, #8c3320 72%, transparent 78%),' +         // Great Red Spot
    'repeating-linear-gradient(7deg, rgba(255,255,255,0.05) 0 1.4%, transparent 1.4% 3%),' +              // fine turbulence
    'repeating-linear-gradient(0deg, #e3c39a 0 5%, #c79a6e 5% 9%, #ecd6b4 9% 13%, #b9885d 13% 17%, #dcbd95 17% 21%, #a9764f 21% 25%, #e7cda6 25% 30%)', // belts/zones
  saturn:
    'repeating-linear-gradient(0deg, #e7d6a6 0 6%, #cdb47e 6% 11%, #f0e3bd 11% 16%, #d4bd86 16% 21%, #c0a468 21% 26%, #e2cf9a 26% 31%)',
  uranus:
    'repeating-linear-gradient(94deg, rgba(255,255,255,0.05) 0 10%, transparent 10% 22%),' +              // faint banding (tilted)
    'radial-gradient(circle at 40% 36%, #d6f3f0, #92d2d6 58%, #5aa3aa 100%)',
  neptune:
    'radial-gradient(ellipse 15% 11% at 58% 64%, rgba(8,16,52,0.62) 0 58%, transparent 74%),' +           // Great Dark Spot
    'radial-gradient(ellipse 20% 6% at 40% 40%, rgba(255,255,255,0.2) 0 48%, transparent 78%),' +          // cloud streak
    'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 9%, transparent 9% 20%),' +
    'radial-gradient(circle at 38% 32%, #6f8bff, #2f4fc9 58%, #142468 100%)',
};

const PLANET_ORDER = PLANETS_DATA.map((p) => p.id);
const AU_MIN_POW = Math.pow(0.39, DIST_EXP);
const AU_MAX_POW = Math.pow(30.06, DIST_EXP);

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

interface Frame { W: number; H: number; k: number; }

// A lit sphere illuminated from screen-direction `sunDirDeg` (degrees, measured
// from +x toward +y/down, pointing AT the Sun). Reused by the fan and the
// focused view; `spin` scrolls the surface bands in the big focused view.
const PlanetBody = ({ planet, size, sunDirDeg, moonRotate = 0, moonEclipse, spin = false, spinSeconds = 30 }: { planet: PlanetData; size: number; sunDirDeg: number; moonRotate?: number; moonEclipse?: { isSolar: boolean; isLunar: boolean }; spin?: boolean; spinSeconds?: number }) => {
  const c = Math.cos(sunDirDeg * DEG);
  const s = Math.sin(sunDirDeg * DEG);
  // Lit highlight toward the Sun; night shadow grows from the anti-solar point
  // so the terminator curves around the limb like a real sphere.
  const lx = 50 + 40 * c, ly = 50 + 40 * s;
  const nx = 50 - 46 * c, ny = 50 - 46 * s;
  const hasAtmo = planet.id === 'earth' || planet.id === 'venus' || planet.id === 'neptune' || planet.id === 'uranus';
  const moonOrbit = size * 2.3;
  const moonDot = Math.max(2.5, size * 0.26);
  return (
    <div className="relative rounded-full" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full shadow-2xl"
        style={{ background: SURFACE[planet.id] || planet.texture, backgroundSize: spin ? '220% 100%' : 'cover' }}
        animate={spin ? { backgroundPositionX: ['0%', '-220%'] } : undefined}
        transition={spin ? { duration: spinSeconds, repeat: Infinity, ease: 'linear' } : undefined}
      >
        {/* day-side specular toward the Sun */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,248,232,0.5) 0%, transparent 46%)` }} />
        {/* spherical night side / terminator from the anti-solar point */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${nx}% ${ny}%, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.72) 26%, rgba(0,0,0,0.34) 46%, transparent 63%)` }} />
      </motion.div>
      {/* atmospheric back-scatter on the sun-facing limb */}
      {hasAtmo && (
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `inset ${(2 * c).toFixed(2)}px ${(2 * s).toFixed(2)}px 5px -1px rgba(150,190,255,0.5)` }} />
      )}
      {/* bright sunlit crescent on the limb facing the Sun */}
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `inset ${(1.6 * c).toFixed(2)}px ${(1.6 * s).toFixed(2)}px 2.5px -0.5px rgba(255,247,230,0.65)` }} />

      {planet.hasRing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[26%] rounded-[50%] rotate-[27deg] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, transparent 38%, ${planet.color}22 41%, ${planet.color}55 49%, transparent 56%, transparent 59%, ${planet.color}66 62%, ${planet.color}33 72%, transparent 77%)` }}
        />
      )}

      {planet.id === 'earth' && moonEclipse?.isSolar && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="absolute w-[44%] h-[44%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.85) 28%, rgba(0,0,0,0.32) 62%, transparent 82%)' }} />
          <div className="absolute w-[16%] h-[16%] rounded-full bg-black/90" style={{ boxShadow: '0 0 4px 1px rgba(255,120,30,0.5)' }} />
        </div>
      )}

      {planet.hasMoon && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: moonOrbit, height: moonOrbit }}>
          <motion.div className="absolute inset-0 will-change-transform" style={{ rotate: moonRotate }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full transition-colors duration-500"
              style={{ width: moonDot, height: moonDot, backgroundColor: moonEclipse?.isLunar ? '#7f1d1d' : '#d1d5db', boxShadow: moonEclipse?.isLunar ? '0 0 5px #ef4444' : '0 0 4px rgba(255,255,255,0.8)', zIndex: (moonRotate % 360) > 180 ? 30 : 10 }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

// One planet on a rotating "arm" pivoting at the corner Sun. The arm carries the
// planet at its real-ratio distance; a static resting angle (fed by the live
// longitude) plus a slow oscillation makes the whole system visibly turn —
// "هرکدوم دور خودش می‌چرخه + آروم جلو می‌ره". Because the Sun is the pivot, the
// planet is always lit from the inner (local 180°) end and casts its dusty
// shadow cone outward (local 0°), so lighting never needs recomputing.
const Planet = ({ planet, date, frame, onFocus, reduced }: { planet: PlanetData; date: Date; frame: Frame; onFocus: (p: PlanetData) => void; reduced: boolean }) => {
  const size = Math.max(SIZE_FLOOR, Math.pow(planet.diameter / EARTH_DIAMETER_KM, SIZE_EXP) * SIZE_BASE) * frame.k;
  const diag = Math.hypot(frame.W, frame.H);
  // Real-ratio distance along the diagonal: inner worlds cluster near the Sun,
  // giants fan far out (Mercury→Neptune mapped to NEAR→FAR).
  const rFrac = DIST_NEAR + ((Math.pow(planet.au, DIST_EXP) - AU_MIN_POW) / (AU_MAX_POW - AU_MIN_POW)) * (DIST_FAR - DIST_NEAR);
  const r = rFrac * diag;
  const idx = PLANET_ORDER.indexOf(planet.id);
  const spread = (idx / (PLANET_ORDER.length - 1) - 0.5) * 2 * FAN_SPREAD_DEG;
  // Resting arm angle: base diagonal + static spread + a live-longitude offset
  // (the real ephemeris still drives the layout). STATIC transform, so the
  // per-minute clock tick can't restart the spin/orbit animations below.
  const restAngle = FAN_ANGLE_DEG + spread + Math.sin(planetLongitude(planet.id, date) * DEG) * FAN_SWAY_DEG;

  const sx = SUN_CX * frame.W, sy = SUN_CY * frame.H; // pivot = Sun centre

  const m = planet.id === 'earth' ? earthMoon(date) : null;
  const moonEclipse = { isSolar: m?.isSolar ?? false, isLunar: m?.isLunar ?? false };

  const coneLen = Math.min(size * 11, diag * 0.34);
  const coneH = Math.max(size * 1.25, 12);
  const hit = Math.max(size, HIT_MIN); // padded so tiny inner worlds stay clickable
  // Inner planets sway faster (Kepler); the per-planet duration also desyncs the fan.
  const orbitDur = 24 + Math.pow(planet.au, 0.7) * 32;

  return (
    <div className="absolute" style={{ left: sx, top: sy, width: 0, height: 0, zIndex: 2 }}>
      {/* Static resting angle (fed by the live longitude). */}
      <div style={{ transformOrigin: '0px 0px', transform: `rotate(${restAngle}deg)` }}>
        {/* Slow orbital oscillation around the resting angle. */}
        <motion.div
          className="will-change-transform"
          style={{ transformOrigin: '0px 0px' }}
          animate={reduced ? { rotate: 0 } : { rotate: [-ORBIT_SWAY_DEG, ORBIT_SWAY_DEG, -ORBIT_SWAY_DEG] }}
          transition={reduced ? undefined : { duration: orbitDur, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Planet at distance r along the arm's local +x. */}
          <div className="absolute" style={{ left: r, top: 0 }}>
            {/* Dusty shadow cone cast outward (anti-solar = local +x). */}
            <div aria-hidden className="absolute pointer-events-none"
              style={{ left: '50%', top: '50%', width: coneLen, height: coneH, transform: 'translateY(-50%)', transformOrigin: '0% 50%', background: 'linear-gradient(90deg, rgba(2,4,12,0.62) 0%, rgba(2,4,12,0.5) 13%, rgba(2,4,12,0.22) 44%, transparent 82%)', borderRadius: '50%', filter: 'blur(3px)', WebkitMaskImage: 'linear-gradient(90deg, #000 0%, #000 7%, transparent 95%)', maskImage: 'linear-gradient(90deg, #000 0%, #000 7%, transparent 95%)', zIndex: 1 }}
            />
            <button type="button" onClick={() => onFocus(planet)} aria-label={`نمایش اطلاعات ${planet.name}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ width: hit, height: hit, zIndex: 2 }}>
              <PlanetBody planet={planet} size={size} sunDirDeg={180} moonRotate={m?.moonRotate ?? 0} moonEclipse={moonEclipse} spin={!reduced} spinSeconds={SPIN_SECONDS[planet.id] ?? 30} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// The corner Sun: a natural warm-white star (white-hot core → warm amber halo,
// not a flat gold disc), anchored just off the top-left corner.
const SunCorner = ({ frame, reduced }: { frame: Frame; reduced: boolean }) => {
  const d = SUN_SIZE * frame.k;
  return (
    <motion.div className="absolute" style={{ left: SUN_CX * frame.W, top: SUN_CY * frame.H, width: d, height: d, transform: 'translate(-50%, -50%)' }}>
      <motion.div className="absolute rounded-full" style={{ inset: -d * 1.7, background: 'radial-gradient(circle, rgba(255,214,150,0.16) 0%, rgba(255,160,70,0.07) 40%, transparent 72%)' }}
        animate={reduced ? undefined : { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={reduced ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute rounded-full" style={{ inset: -d * 0.85, background: 'radial-gradient(circle, rgba(255,228,180,0.3) 0%, rgba(255,180,90,0.12) 46%, transparent 72%)', filter: 'blur(10px)' }} />
      <div className="absolute rounded-full" style={{ inset: -d * 0.28, background: 'radial-gradient(circle, rgba(255,246,224,0.6) 0%, transparent 70%)', filter: 'blur(5px)' }} />
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fff6e0 16%, #ffe2a6 40%, #ffc266 66%, #ff9d3c 100%)', boxShadow: `0 0 ${d * 0.6}px rgba(255,190,110,0.7)` }} />
      <div className="absolute inset-[14%] rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, transparent 72%)', opacity: 0.55 }} />
    </motion.div>
  );
};

// Focused "game" view: tap a planet → it blooms to centre beside a live data
// card (current state from the real ephemeris). Backdrop click / Escape closes.
const PlanetFocus = ({ planet, date, onClose, reduced }: { planet: PlanetData | null; date: Date | null; onClose: () => void; reduced: boolean }) => {
  useEffect(() => {
    if (!planet) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [planet, onClose]);

  const big = 300;
  const m = planet && date && planet.id === 'earth' ? earthMoon(date) : null;
  const lon = planet && date ? Math.round(planetLongitude(planet.id, date)) : 0;
  const periodLabel = planet
    ? planet.period >= 1000
      ? `${(planet.period / 365.25).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} سال`
      : `${planet.period.toLocaleString('fa-IR')} روز`
    : '';
  const rows: [string, string][] = planet
    ? [
        ['قطر', `${planet.diameter.toLocaleString('fa-IR')} کیلومتر`],
        ['فاصله از خورشید', `${planet.au.toLocaleString('fa-IR')} AU`],
        ['دورهٔ گردش', periodLabel],
        ['دما', planet.temp],
        ['جرم', planet.mass],
        ['طول دائرةالبروجیِ کنونی', `${lon.toLocaleString('fa-IR')}°`],
      ]
    : [];

  return (
    <AnimatePresence>
      {planet && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.3 }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label={`اطلاعات ${planet.name}`}
        >
          <div className="absolute inset-0 bg-black/82 backdrop-blur-lg" />
          <motion.div
            className="relative z-10 mx-4 flex max-w-3xl flex-col items-center gap-8 md:flex-row md:gap-14"
            initial={reduced ? false : { scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={reduced ? undefined : { scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="shrink-0"
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: big, height: big }}
            >
              <PlanetBody planet={planet} size={big} sunDirDeg={221} moonRotate={m?.moonRotate ?? 0} moonEclipse={{ isSolar: m?.isSolar ?? false, isLunar: m?.isLunar ?? false }} spin={!reduced} spinSeconds={Math.max(14, (SPIN_SECONDS[planet.id] ?? 30) * 0.6)} />
            </motion.div>

            <div dir="rtl" className="w-full max-w-sm rounded-3xl border border-white/12 bg-[#0a0d16]/85 p-7 text-right shadow-2xl backdrop-blur-2xl">
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-3xl font-black text-white">{planet.name}</h3>
                <span className="font-display text-sm text-white/50">{planet.enName}</span>
              </div>
              <dl className="space-y-2.5">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 border-b border-white/5 pb-2.5 text-sm">
                    <dt className="font-display text-white/55">{label}</dt>
                    <dd className="font-display font-bold text-white">{value}</dd>
                  </div>
                ))}
                {planet.id === 'earth' && m && (
                  <div className="flex items-center justify-between gap-4 pt-1 text-sm">
                    <dt className="font-display text-white/55">فاز ماه</dt>
                    <dd className="font-display font-bold text-white">
                      {moonPhaseName(m.elongation)}
                      {m.isSolar && <span className="mr-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] text-amber-300">خورشیدگرفتگی</span>}
                      {m.isLunar && <span className="mr-2 rounded-full bg-rose-500/20 px-2 py-0.5 text-[11px] text-rose-300">ماه‌گرفتگی</span>}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </motion.div>

          <button type="button" onClick={onClose} aria-label="بستن"
            className="absolute right-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white/80">
            <span className="text-xl leading-none">✕</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function GlobalUniverse({ renderBackground = false, scrollProgress: externalProgress }: { renderBackground?: boolean, scrollProgress?: number }) {
 const { scrollYProgress } = useScroll();
 const [progress, setProgress] = useState(0);
 const prefersReducedMotion = usePrefersReducedMotion();

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

 // The corner Sun + the fan are positioned as fractions of the hero box, so we
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

 const [focused, setFocused] = useState<PlanetData | null>(null);

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

 const frame: Frame | null = size
   ? { W: size.W, H: size.H, k: Math.max(0.5, Math.min(1.15, Math.hypot(size.W, size.H) / 1600)) }
   : null;

 return (
  <div ref={frameRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[50]">
   {/* Warm light scattering through the dusty field, anchored at the corner Sun
       — this is the haze the shadow cones cut into. */}
   <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(75% 75% at ${SUN_CX * 100}% ${SUN_CY * 100}%, rgba(255,206,140,0.10) 0%, rgba(255,168,82,0.05) 30%, transparent 64%)` }} />
   {frame && (
    <>
     <SunCorner frame={frame} reduced={prefersReducedMotion} />
     {date && PLANETS_DATA.map((planet) => (
      <Planet key={planet.id} planet={planet} date={date} frame={frame} onFocus={setFocused} reduced={prefersReducedMotion} />
     ))}
    </>
   )}
   <PlanetFocus planet={focused} date={date} onClose={() => setFocused(null)} reduced={prefersReducedMotion} />
  </div>
 );
}