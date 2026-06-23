'use client';

import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import ProjectModal from './ProjectModal';
import { Project, ProjectCard } from '../ui/ProjectCard';
import { Card } from '../ui/Card';
import { Section, Heading } from '../ui/Layout';
import { Box, ArrowUpLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { PROJECTS_DATA } from '@/lib/data/projects';
import { TOOLS, type Tool } from '@/lib/data/tools';

// Selected High-Impact Projects for the Top Slider — sourced from the single
// PROJECTS_DATA store (by slug, in display order) so descriptions/metrics never
// drift from the canonical data.
const SELECTED_SLUGS = ['ravro-platform', 'kish-airport-fids', 'pixel-ball', 'malata-platform'];
const SELECTED_PROJECTS: Project[] = SELECTED_SLUGS
  .map((slug) => PROJECTS_DATA.find((p) => p.slug === slug))
  .filter((p): p is Project => !!p && !p.hidden);

// Most-used tools — shown as square Card-based tiles continuing the projects scroll.
const FEATURED_TOOLS = TOOLS.filter((t) => t.featured && t.status !== 'soon');

// Pack the featured tools into columns of two so a pair of square tiles fits the
// exact height of a single project card, keeping the horizontal rhythm intact.
const TOOL_COLUMNS: Tool[][] = [];
for (let i = 0; i < FEATURED_TOOLS.length; i += 2) {
  TOOL_COLUMNS.push(FEATURED_TOOLS.slice(i, i + 2));
}

// Square tool tile built on the shared Card so it inherits the exact 3D tilt,
// glass and corner-lighting physics of the project cards.
function SquareToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const accent = tool.accent;
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block h-full w-full rounded-[1.75rem] outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <Card
        glowColor={`rgba(${accent}, 0.22)`}
        roundedClass="rounded-[1.75rem]"
        className="p-2 md:p-3"
        contentClassName="p-4 md:p-5"
        isHoverable
        colorOnHoverOnly
      >
        <div className="flex h-full w-full flex-col text-right" dir="rtl" style={{ transformStyle: 'preserve-3d' }}>
          <div className="flex items-start justify-between" style={{ transform: 'translateZ(40px)' }}>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: `rgba(${accent}, 0.12)`, color: `rgb(${accent})` }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <ArrowUpLeft
              className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              style={{ color: `rgb(${accent})` }}
              aria-hidden
            />
          </div>
          <div className="mt-auto" style={{ transform: 'translateZ(30px)' }}>
            <h3 className="font-display text-sm md:text-base font-black leading-snug text-foreground">
              {tool.title}
            </h3>
            <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed text-muted-foreground">
              {tool.desc}
            </p>
          </div>
        </div>
      </Card>
    </Link>
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
 const scrollContainerRef = useRef<HTMLDivElement>(null);
 const sectionRef = useRef<HTMLDivElement>(null);
 
 const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start end", "end start"]
 });
 const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

 // Start both fades hidden, then derive them from real measurements on mount
 // so the gradients never flash wrong before the first scroll event (RTL paint).
 const [canScrollLeft, setCanScrollLeft] = useState(false);
 const [canScrollRight, setCanScrollRight] = useState(false);

 const handleScroll = useCallback(() => {
  if (scrollContainerRef.current) {
   const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
   const absScroll = Math.abs(scrollLeft);
   const maxScroll = scrollWidth - clientWidth;
   setCanScrollLeft(absScroll < maxScroll - 10);
   setCanScrollRight(absScroll > 10);
  }
 }, []);

 // Sync fades with the real scroll position/overflow immediately on mount and
 // whenever the viewport resizes (overflow can appear/disappear at breakpoints).
 useLayoutEffect(() => {
  handleScroll();
  window.addEventListener('resize', handleScroll);
  return () => window.removeEventListener('resize', handleScroll);
 }, [handleScroll]);

 // Wheel-to-horizontal: while the pointer is over the card row, translate the
 // vertical wheel into horizontal scrolling and LOCK the page's vertical scroll
 // (preventDefault). At the horizontal edges the wheel is released back to the
 // page so the user is never trapped. `data-lenis-prevent` on the scroller stops
 // Lenis from also driving the wheel here.
 useEffect(() => {
  const el = scrollContainerRef.current;
  if (!el) return;
  const onWheel = (e: WheelEvent) => {
   if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already a horizontal gesture
   const maxScroll = el.scrollWidth - el.clientWidth;
   if (maxScroll <= 0) return;
   const abs = Math.abs(el.scrollLeft);
   const forward = e.deltaY > 0; // wheel down = advance toward the end
   if ((forward && abs >= maxScroll - 1) || (!forward && abs <= 1)) return; // edge → release
   e.preventDefault();
   el.scrollLeft -= e.deltaY; // RTL: down → more negative (toward the end/left)
   handleScroll();
  };
  el.addEventListener('wheel', onWheel, { passive: false });
  return () => el.removeEventListener('wheel', onWheel);
 }, [handleScroll]);

 // Nav buttons / arrow keys scroll by roughly one viewport of cards.
 const scrollByCards = useCallback((dir: 'next' | 'prev') => {
  const el = scrollContainerRef.current;
  if (!el) return;
  const amount = Math.round(el.clientWidth * 0.8);
  // RTL: "next" (forward) moves toward the end → more negative scrollLeft.
  el.scrollBy({ left: dir === 'next' ? -amount : amount, behavior: 'smooth' });
 }, []);

 const onScrollerKeyDown = useCallback((e: React.KeyboardEvent) => {
  if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByCards('next'); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); scrollByCards('prev'); }
 }, [scrollByCards]);

 return (
 <Section id="projects" sectionRef={sectionRef} className="border-t border-border overflow-visible !pb-fib-55 bg-transparent">
  <motion.div aria-hidden="true" style={{ y: bgY }} className="absolute top-0 right-0 -mr-fib-34 -mt-fib-34 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
  <Box className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
  </motion.div>

  <Heading subtitle="منتخب">پروژه‌های</Heading>

  <div className="relative group/projects-container mb-fib-34 -mr-fib-5 md:-mr-fib-8">
  <div className={`absolute inset-y-0 right-0 w-20 md:w-fib-55 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
  <div className={`absolute inset-y-0 left-0 w-20 md:w-fib-55 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />

  {/* Desktop scroll controls — RTL: "next/forward" sits on the left (chevron
      left), "prev/back" on the right. Shown only when there is room to move. */}
  <button
   type="button"
   aria-label="پروژه‌های بعدی"
   onClick={() => scrollByCards('next')}
   className={`hidden md:flex absolute top-1/2 left-3 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-background/70 border border-border backdrop-blur-md text-foreground shadow-lg transition-all duration-300 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-primary/50 outline-none ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
  >
   <ChevronLeft className="h-5 w-5" />
  </button>
  <button
   type="button"
   aria-label="پروژه‌های قبلی"
   onClick={() => scrollByCards('prev')}
   className={`hidden md:flex absolute top-1/2 right-3 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-background/70 border border-border backdrop-blur-md text-foreground shadow-lg transition-all duration-300 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-primary/50 outline-none ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
  >
   <ChevronRight className="h-5 w-5" />
  </button>

  <div
   ref={scrollContainerRef}
   onScroll={handleScroll}
   onKeyDown={onScrollerKeyDown}
   data-lenis-prevent
   tabIndex={0}
   role="region"
   aria-label="اسکرول افقی پروژه‌ها و ابزارها — برای پیمایش از کلیدهای جهت‌نما استفاده کنید"
   className="flex items-center overflow-x-auto overscroll-x-contain pb-20 scrollbar-hide relative z-10 gap-0 outline-none rounded-[2rem]">
   {SELECTED_PROJECTS.map((p) => (
   <div key={p.id} data-project-frame className="w-[280px] md:w-[320px] min-h-[360px] md:min-h-[380px] shrink-0 relative" style={{ zIndex: activeId === p.id ? 50 : 1 }}>
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
       per column so a pair fits the exact height of one project card. */}
   {TOOL_COLUMNS.map((col, ci) => (
   <div key={ci} className="w-[210px] md:w-[240px] min-h-[360px] md:min-h-[380px] shrink-0 flex flex-col">
    {col.map((tool) => (
    <div key={tool.slug} className="flex-1 min-h-0">
     <SquareToolCard tool={tool} />
    </div>
    ))}
   </div>
   ))}
  </div>
  </div>

  <ProjectModal project={selectedProject} originRect={originRect} isOpen={!!selectedProject} onClose={() => { setSelectedProject(null); setActiveId(null); }} />
 </Section>
 );
}
