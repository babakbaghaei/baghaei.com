'use client';

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';
import ProjectModal from './ProjectModal';
import { Project, ProjectCard } from '../ui/ProjectCard';
import { ToolCard } from '../ui/ToolCard';
import { Section, Heading } from '../ui/Layout';
import { Box } from 'lucide-react';
import { PROJECTS_DATA } from '@/lib/data/projects';
import { TOOLS, type Tool } from '@/lib/data/tools';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';
import { parallaxBus } from '@/lib/utils/parallaxBus';

// Selected High-Impact Projects for the Top Slider — sourced from the single
// PROJECTS_DATA store (by slug, in display order) so descriptions/metrics never
// drift from the canonical data.
const SELECTED_SLUGS = ['ravro-platform', 'kish-airport-fids', 'pixel-ball', 'malata-platform'];
const SELECTED_PROJECTS: Project[] = SELECTED_SLUGS
  .map((slug) => PROJECTS_DATA.find((p) => p.slug === slug))
  .filter((p): p is Project => !!p && !p.hidden);

// Most-used tools — shown as square Card-based tiles continuing the projects scroll.
const FEATURED_TOOLS = TOOLS.filter((t) => t.featured && t.status !== 'soon' && !t.hidden);

// Pack the featured tools into columns of two so a pair of square tiles fits the
// exact height of a single project card, keeping the horizontal rhythm intact.
const TOOL_COLUMNS: Tool[][] = [];
for (let i = 0; i < FEATURED_TOOLS.length; i += 2) {
  TOOL_COLUMNS.push(FEATURED_TOOLS.slice(i, i + 2));
}

// RTL: scrolling forward should reveal cards toward the left, so the row
// translates in the +X (rightward) physical direction as progress goes 0→1.
const RTL_SIGN = 1;

// Desktop sticky-pin: a tall track pins an inner viewport while vertical scroll
// progress translates the card row horizontally. No wheel hijack, no mode
// switch — Lenis drives the whole thing, so the horizontal→vertical handoff is
// seamless. This lives in its own component so `useScroll({ target })` only ever
// runs while the track element is actually mounted (mounting it conditionally
// inside the parent would leave the ref unhydrated and throw).
function PinnedRow({ children }: { children: React.ReactNode }) {
 const pinTrackRef = useRef<HTMLDivElement>(null);
 const pinViewportRef = useRef<HTMLDivElement>(null);
 const rowRef = useRef<HTMLDivElement>(null);
 const overflowRef = useRef(0);
 const [pinHeight, setPinHeight] = useState('100vh');
 const lenis = useLenis();

 // Keyboard reveal: a card/link tabbed-to while it is translated outside the
 // viewport would otherwise receive an invisible focus (the row is moved by a
 // transform, so the browser can't scroll it into view). Map the element's live
 // horizontal offset back to the vertical scroll that drives the pin and glide
 // there, so focus order stays visible. RTL_SIGN: +1px scroll → +1px translate,
 // so the scroll delta equals the horizontal delta needed to centre the element.
 const revealOnFocus = (e: React.FocusEvent<HTMLDivElement>) => {
  const el = e.target as HTMLElement;
  const track = pinTrackRef.current;
  if (!el || el === e.currentTarget || !track) return;
  const vw = window.innerWidth;
  const margin = 24;
  const rect = el.getBoundingClientRect();
  if (rect.left >= margin && rect.right <= vw - margin) return; // already visible
  const desiredLeft = Math.max(margin, (vw - rect.width) / 2);
  const trackTop = track.getBoundingClientRect().top + window.scrollY;
  const targetY = Math.min(
   Math.max(window.scrollY + (desiredLeft - rect.left) / RTL_SIGN, trackTop),
   trackTop + overflowRef.current
  );
  if (lenis) lenis.scrollTo(targetY, { duration: 0.4 });
  else if (typeof window !== 'undefined') window.scrollTo({ top: targetY });
 };

 const { scrollYProgress } = useScroll({
  target: pinTrackRef,
  offset: ['start start', 'end end'],
 });
 // Eased shoulders: ramp the horizontal travel gently across the first/last
 // slice of the pin so the vertical→horizontal→vertical handoff feels like a
 // deliberate glide rather than a hard scroll-lock. The middle ~88% stays
 // near-linear, so the keyboard reveal + star parallax still track ~1:1.
 const xProgress = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 0.03, 0.97, 1]);
 // Read the measured overflow from a ref inside the transform so the mapping
 // always uses the latest width without re-instantiating the motion value.
 const x = useTransform(xProgress, (v) => v * RTL_SIGN * overflowRef.current);

 // Publish horizontal pin progress to the star field so the background travels
 // sideways with the cards (and freezes its vertical drift) while pinned.
 useEffect(() => {
  const unsub = scrollYProgress.on('change', (v) => {
   parallaxBus.hx = v;
   parallaxBus.pinActive = v > 0.001 && v < 0.999;
  });
  return () => {
   unsub();
   parallaxBus.pinActive = false;
   parallaxBus.hx = 0;
  };
 }, [scrollYProgress]);

 useLayoutEffect(() => {
  const measure = () => {
   const row = rowRef.current;
   const vp = pinViewportRef.current;
   if (!row || !vp) return;
   const overflow = Math.max(0, row.scrollWidth - vp.clientWidth);
   overflowRef.current = overflow;
   // Track tall enough that vertical travel equals the horizontal overflow
   // (1px scrolled ≈ 1px translated), plus one viewport so the pin holds.
   setPinHeight(`${window.innerHeight + overflow}px`);
  };
  measure();
  const ro = new ResizeObserver(measure);
  if (rowRef.current) ro.observe(rowRef.current);
  window.addEventListener('resize', measure);
  return () => {
   ro.disconnect();
   window.removeEventListener('resize', measure);
  };
 }, []);

 return (
  <div ref={pinTrackRef} className="relative -mr-fib-5 md:-mr-fib-8" style={{ height: pinHeight }}>
   <div ref={pinViewportRef} className="sticky top-0 h-screen flex items-center overflow-hidden">
    <motion.div ref={rowRef} onFocus={revealOnFocus} style={{ x }} className="flex items-center gap-5 md:gap-6 w-max will-change-transform px-fib-5 md:px-fib-8">
     {children}
    </motion.div>
    {/* Horizontal-scroll progress: a small meter under the row that fills as the
        pinned gallery advances, so the sideways motion reads as intentional
        navigation. RTL → it fills from the right (origin-right). */}
    <div aria-hidden className="pointer-events-none absolute bottom-10 left-1/2 z-20 h-[3px] w-28 -translate-x-1/2 overflow-hidden rounded-full bg-foreground/10">
     <motion.div style={{ scaleX: scrollYProgress }} className="h-full w-full origin-right rounded-full bg-foreground/45" />
    </div>
   </div>
  </div>
 );
}

export default function Projects() {
 const [selectedProject, setSelectedProject] = useState<Project | null>(null);
 const [originRect, setOriginRect] = useState<DOMRect | null>(null);
 const [activeId, setActiveId] = useState<number | null>(null);

 const openProject = (p: Project, e: React.MouseEvent<HTMLDivElement>) => {
  // Measure the clean, untransformed card frame (not the inner padded div,
  // which is skewed by the Card's live 3D tilt) so the grow animation starts
  // from the card's true on-screen rectangle.
  const frame = (e.currentTarget as HTMLElement).closest('[data-project-frame]') as HTMLElement | null;
  setOriginRect((frame ?? e.currentTarget).getBoundingClientRect());
  setSelectedProject(p);
  setActiveId(p.id);
 };

 const sectionRef = useRef<HTMLDivElement>(null);

 const { scrollYProgress: sectionProgress } = useScroll({
  target: sectionRef,
  offset: ["start end", "end start"]
 });
 const bgY = useTransform(sectionProgress, [0, 1], [-100, 100]);

 // Pick the interaction model once on the client. Default to the universally
 // safe native horizontal row for SSR/first paint, then upgrade to the
 // sticky-pinned scroll on desktop after mount. Reduced motion always falls
 // back to a plain vertical stack (no pin, no horizontal motion).
 const prefersReducedMotion = usePrefersReducedMotion();
 const [isDesktop, setIsDesktop] = useState(false);
 useEffect(() => {
  const mq = window.matchMedia('(min-width: 768px)');
  const update = () => setIsDesktop(mq.matches);
  update();
  mq.addEventListener('change', update);
  return () => mq.removeEventListener('change', update);
 }, []);
 const mode: 'pin' | 'native' | 'stack' = prefersReducedMotion ? 'stack' : isDesktop ? 'pin' : 'native';

 // ---- Native (mobile) horizontal row -----------------------------------------
 const scrollContainerRef = useRef<HTMLDivElement>(null);

 // Shared horizontal content (projects → divider → tool columns). Used by both
 // the pinned desktop row and the native mobile row so the two never drift.
 const horizontalItems = (
  <>
   {SELECTED_PROJECTS.map((p) => (
    <div key={p.id} data-project-frame className="w-[280px] md:w-[360px] h-[360px] md:h-[380px] shrink-0 relative" style={{ zIndex: activeId === p.id ? 50 : 1 }}>
     <ProjectCard project={p} onClick={(e) => openProject(p, e)} />
    </div>
   ))}

   {/* Divider between flagship projects and the most-used tools */}
   <div className="shrink-0 self-stretch flex flex-col items-center justify-center gap-4 px-fib-5 md:px-fib-8">
    <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
    <span className="text-xs font-display font-bold uppercase tracking-widest text-muted-foreground/60 [writing-mode:vertical-rl] rotate-180">ابزارها</span>
    <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
   </div>

   {/* Most-used tools continuing the same horizontal scroll — two square tiles
       per column so a pair fits the exact height of one project card. Tiles use
       a FIXED height (not flex-1) so a lone tile in an odd-length column can
       never stretch to full height — every tool tile stays the same size. */}
   {TOOL_COLUMNS.map((col, ci) => (
    <div key={ci} className="w-[210px] md:w-[240px] h-[360px] md:h-[380px] shrink-0 flex flex-col gap-5 md:gap-6">
     {col.map((tool) => (
      <div key={tool.slug} className="h-[170px] md:h-[178px]">
       <ToolCard tool={tool} accent={tool.accent} compact />
      </div>
     ))}
    </div>
   ))}
  </>
 );

 return (
 <Section id="projects" sectionRef={sectionRef} className="border-t border-border overflow-visible !pb-fib-21 bg-transparent">
  <motion.div aria-hidden="true" style={{ y: bgY }} className="absolute top-0 right-0 -mr-fib-34 -mt-fib-34 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
  <Box className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
  </motion.div>

  <Heading subtitle="منتخب">پروژه‌های</Heading>

  {mode === 'pin' ? (
   // Desktop: sticky-pinned horizontal scroll driven by vertical progress.
   <PinnedRow>{horizontalItems}</PinnedRow>
  ) : mode === 'stack' ? (
   // Reduced motion: plain vertical stack — no pin, no horizontal travel.
   <div className="flex flex-col items-center gap-fib-13 mb-fib-13">
    {SELECTED_PROJECTS.map((p) => (
     <div key={p.id} data-project-frame className="w-full max-w-[420px] min-h-[360px] md:min-h-[380px] relative" style={{ zIndex: activeId === p.id ? 50 : 1 }}>
      <ProjectCard project={p} onClick={(e) => openProject(p, e)} />
     </div>
    ))}
    {FEATURED_TOOLS.map((tool) => (
     <div key={tool.slug} className="w-full max-w-[420px] h-[200px]">
      <ToolCard tool={tool} accent={tool.accent} compact />
     </div>
    ))}
   </div>
  ) : (
   // Mobile: native horizontal swipe row (no wheel hijack). data-lenis-prevent
   // lets native touch drive horizontal scrolling without Lenis interference.
   <div className="mb-fib-8 -mr-fib-5 md:-mr-fib-8">
    {/* No edge-fade on mobile: native swipe row scrolls clean to the edges. */}
    <div
     ref={scrollContainerRef}
     data-lenis-prevent
     role="region"
     aria-label="اسکرول افقی پروژه‌ها و ابزارها"
     className="flex items-center overflow-x-auto overscroll-x-contain pb-10 scrollbar-hide relative z-10 gap-5 md:gap-6 rounded-[2rem]">
     {horizontalItems}
    </div>
   </div>
  )}

  <ProjectModal project={selectedProject} originRect={originRect} isOpen={!!selectedProject} onClose={() => { setSelectedProject(null); setActiveId(null); }} />
 </Section>
 );
}
