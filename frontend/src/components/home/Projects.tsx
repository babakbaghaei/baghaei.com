'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import ProjectModal from './ProjectModal';
import { Project, ProjectCard } from '../ui/ProjectCard';
import { Card } from '../ui/Card';
import { Section, Heading } from '../ui/Layout';
import { Box, ArrowUpLeft } from 'lucide-react';
import { TOOLS, type Tool } from '@/lib/data/tools';

// Selected High-Impact Projects for the Top Slider
const SELECTED_PROJECTS: Project[] = [
  {
    id: 2,
    slug: 'ravro-platform',
    title: 'پلتفرم راورو',
    category: 'امنیت سایبری',
    role: 'طراح ارشد رابط کاربری',
    desc: 'توسعه پلتفرم باگ‌بانتی با هدف شناسایی شکاف‌های امنیتی توسط هکرهای کلاه سفید در مقیاس ملی.',
    metrics: [{ label: 'باگ کشف شده', value: '۱K+' }, { label: 'شرکت فعال', value: '۵۰+' }],
    color: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.8)',
    isLocked: false,
    images: ['/assets/projects/ravro-dashboard.jpg', '/assets/projects/ravro-target.jpg'],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker']
  },
  {
    id: 1,
    slug: 'kish-airport-fids',
    title: 'FIDS فرودگاه کیش',
    category: 'زیرساخت فرودگاهی',
    role: 'طراح ارشد رابط کاربری',
    desc: 'طراحی سیستم‌های نمایش اطلاعات پرواز و رابط کاربری کانترهای فرودگاه بین‌المللی کیش.',
    metrics: [{ label: 'دقت نمایش', value: '۹۹.۹٪' }, { label: 'ترافیک روزانه', value: '۲۰K+' }],
    color: 'rgba(30, 64, 175, 0.2)',
    borderColor: 'rgba(30, 64, 175, 0.8)',
    isLocked: false,
    images: ['/assets/projects/fids-kish-gate.jpg', '/assets/projects/fids-kish-system.jpg'],
    tech: ['C++', 'Qt', 'WebSockets', 'Linux']
  },
  {
    id: 9,
    slug: 'kevany-tuning',
    title: 'تیونینگ کیوانی',
    category: 'خودرو / لوکس',
    role: 'طراح رابط کاربری',
    desc: 'طراحی پلتفرم اختصاصی و سیستم پیکربندی خودروهای فوق‌لوکس برای برند جهانی Kevany.',
    metrics: [{ label: 'خودرو اختصاصی', value: '۱۰۰+' }, { label: 'بازدید جهانی', value: '۱M+' }],
    color: 'rgba(153, 27, 27, 0.3)',
    borderColor: 'rgba(153, 27, 27, 0.8)',
    isLocked: false,
    images: ['/assets/projects/keyvani-configurator.jpg'],
    tech: ['WebGL', 'Three.js', 'React', 'Next.js']
  },
  {
    id: 5,
    title: 'پلتفرم مالاتا',
    category: 'تجارت الکترونیک',
    role: 'بنیان‌گذار فنی و معمار نرم‌افزار',
    desc: 'اولین بازار آنلاین محصولات تازه دریایی با هدف حذف واسطه‌ها و اتصال مستقیم صیاد به مشتری.',
    metrics: [{ label: 'فروشنده فعال', value: '۵۰۰+' }, { label: 'رضایت مشتری', value: '۹۵٪' }],
    color: 'rgba(14, 165, 233, 0.2)',
    borderColor: 'rgba(14, 165, 233, 0.8)',
    isLocked: false,
    tech: ['Next.js', 'Go', 'Redis', 'Kubernetes']
  }
];

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
      aria-label={tool.title}
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
            <p className="mt-1 line-clamp-2 font-sans text-[11px] md:text-xs leading-relaxed text-muted-foreground">
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

 const [canScrollLeft, setCanScrollLeft] = useState(true);
 const [canScrollRight, setCanScrollRight] = useState(false);

 const handleScroll = () => {
  if (scrollContainerRef.current) {
   const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
   const absScroll = Math.abs(scrollLeft);
   const maxScroll = scrollWidth - clientWidth;
   setCanScrollLeft(absScroll < maxScroll - 10);
   setCanScrollRight(absScroll > 10);
  }
 };

 return (
 <Section id="projects" sectionRef={sectionRef} className="border-t border-border overflow-visible !pb-fib-55 bg-transparent">
  <motion.div aria-hidden="true" style={{ y: bgY }} className="absolute top-0 right-0 -mr-fib-34 -mt-fib-34 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
  <Box className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
  </motion.div>

  <Heading subtitle="منتخب">پروژه‌های</Heading>

  <div className="relative group/projects-container mb-fib-34 -mr-fib-5 md:-mr-fib-8">
  <div className={`absolute inset-y-0 right-0 w-fib-55 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
  <div className={`absolute inset-y-0 left-0 w-fib-55 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />

  <div ref={scrollContainerRef} onScroll={handleScroll} className="flex items-center overflow-x-auto overscroll-x-contain pb-20 no-scrollbar relative z-10 gap-0">
   {SELECTED_PROJECTS.map((p) => (
   <div key={p.id} data-project-frame className="w-[280px] md:w-[320px] h-[420px] md:h-[480px] shrink-0 relative" style={{ zIndex: activeId === p.id ? 50 : 1 }}>
    <ProjectCard project={p} onClick={(e) => openProject(p, e)} />
   </div>
   ))}

   {/* Divider between flagship projects and the most-used tools */}
   <div className="shrink-0 self-stretch flex flex-col items-center justify-center gap-4 px-fib-5 md:px-fib-8">
    <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
    <span className="text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground/60 [writing-mode:vertical-rl] rotate-180">ابزارها</span>
    <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
   </div>

   {/* Most-used tools continuing the same horizontal scroll — two square tiles
       per column so a pair fits the exact height of one project card. */}
   {TOOL_COLUMNS.map((col, ci) => (
   <div key={ci} className="w-[210px] md:w-[240px] h-[420px] md:h-[480px] shrink-0 flex flex-col">
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
