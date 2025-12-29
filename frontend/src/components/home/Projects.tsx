'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { Project, ProjectCard } from '../ui/ProjectCard';
import { Section, Heading } from '../ui/Layout';
import { PROJECTS_DATA } from '@/lib/data/projects';
import { ArrowLeft, Box, PenTool, Keyboard, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TOOLS_DATA: Project[] = [
  {
    id: 101,
    title: 'دستیار چک‌نویس',
    category: 'ابزار مالی',
    role: 'تبدیل عدد به حروف',
    desc: 'مبدل هوشمند و دقیق عدد به حروف فارسی جهت نوشتن آسان و بدون خطای چک‌های صیادی و اسناد مالی.',
    metrics: [{ label: 'دقت تبدیل', value: '۱۰۰٪' }, { label: 'پشتیبانی', value: 'ریال/تومان' }],
    color: 'rgba(99, 102, 241, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.8)',
    isLocked: false,
    href: '/tools/cheque-nevis'
  },
  {
    id: 102,
    title: 'تایپِ جنگی',
    category: 'سرگرمی و مهارت',
    role: 'تست سرعت تایپ',
    desc: 'سنجش سرعت و دقت تایپ فارسی با استفاده از دیالوگ‌های ماندگار و چالش‌های هیجان‌انگیز.',
    metrics: [{ label: 'دقت آماری', value: 'تایپ' }, { label: 'حالت', value: 'بی‌پایان' }],
    color: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.8)',
    isLocked: false,
    href: '/tools/type-jangi'
  },
  {
    id: 103,
    title: 'چرخونه تصمیم',
    category: 'ابزار کمکی',
    role: 'تصمیم‌گیری شانس',
    desc: 'ابزاری مدرن و سرگرم‌کننده برای حل تردیدها و تصمیم‌گیری‌های سخت با چرخونه شانس.',
    metrics: [{ label: 'فیزیک', value: 'واقعی' }, { label: 'رابط', value: 'مینیمال' }],
    color: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.8)',
    isLocked: false,
    href: '/tools/spin-win'
  },
  {
    id: 104,
    title: 'رهگیری عادت',
    category: 'بهره‌وری',
    role: 'مدیریت روتین',
    desc: 'سیستم هوشمند برای ثبت و پیگیری عادت‌های روزانه و تحلیل روند پیشرفت فردی.',
    metrics: [{ label: 'وضعیت', value: 'آزمایشی' }, { label: 'تحلیل', value: 'دقیق' }],
    color: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.8)',
    isLocked: true
  },
  {
    id: 105,
    title: 'ژورنال نویسی',
    category: 'ذهن‌آگاهی',
    role: 'ثبت افکار',
    desc: 'فضایی امن و مینیمال برای نوشتن افکار روزانه و مدیریت سلامت روان با استفاده از متدهای مدرن.',
    metrics: [{ label: 'امنیت', value: 'بالا' }, { label: 'رابط', value: 'آرامش' }],
    color: 'rgba(236, 72, 153, 0.2)',
    borderColor: 'rgba(236, 72, 153, 0.8)',
    isLocked: true
  },
  {
    id: 106,
    title: 'کی سیکس پکس در میارم؟',
    category: 'سلامت و تناسب',
    role: 'محاسبه‌گر زمان',
    desc: 'ابزاری سرگرم‌کننده و علمی برای تخمین زمان رسیدن به شکم شش‌تکه بر اساس شاخص‌های بدنی.',
    metrics: [{ label: 'دقت', value: 'تخمینی' }, { label: 'انگیزه', value: '۱۰۰٪' }],
    color: 'rgba(249, 115, 22, 0.2)',
    borderColor: 'rgba(249, 115, 22, 0.8)',
    isLocked: true
  }
];

export default function Projects() {
 const router = useRouter();
 const [selectedProject, setSelectedProject] = useState<Project | null>(null);
 const [activeId, setActiveId] = useState<number | null>(null);
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
 <Section id="projects" sectionRef={sectionRef} className="border-t border-border overflow-visible !pb-fib-55">
  <motion.div style={{ y: bgY }} className="absolute top-0 right-0 -mr-fib-34 -mt-fib-34 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
  <Box className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
  </motion.div>

  <Heading subtitle="منتخب">پروژه‌های</Heading>

  <div className="relative group/projects-container mb-fib-34 -mr-fib-5 md:-mr-fib-8">
  {/* Scroller Fades */}
  <div 
   className={`absolute inset-y-0 right-0 w-fib-55 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} 
  />
  <div 
   className={`absolute inset-y-0 left-0 w-fib-55 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} 
  />

  <div 
   ref={scrollContainerRef}
   onScroll={handleScroll}
   className="flex overflow-x-auto pb-20 no-scrollbar relative z-10 gap-0"
  >
   {PROJECTS_DATA.map((p, i) => (
   <div 
    key={p.id} 
    className="w-[280px] md:w-[320px] h-[420px] md:h-[480px] shrink-0 relative"
    style={{ zIndex: activeId === p.id ? 50 : 1 }}
   >
    <ProjectCard 
    project={p} 
    onClick={() => { setSelectedProject(p); setActiveId(p.id); }}
    isActive={selectedProject?.id === p.id}
    index={i}
    scrollProgress={scrollYProgress}
    />
   </div>
   ))}
  </div>
  </div>

  {/* Tools Section - Increased margin-top and updated gap */}
  <div className="w-full mt-24 mb-0 relative z-10">
  <div className="flex items-center gap-6 mb-12 opacity-50 px-1 md:px-2">
   <div className="h-[1px] bg-border flex-1" />
   <h4 className="text-muted-foreground font-display text-xs md:text-sm uppercase font-bold">ابزارها</h4>
   <div className="h-[1px] bg-border flex-1" />
  </div>
  
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
   {TOOLS_DATA.map((tool, i) => (
   <div 
    key={tool.id} 
    className="aspect-square relative"
    style={{ zIndex: activeId === tool.id ? 50 : 1 }}
   >
    <ProjectCard 
    project={tool} 
    onClick={() => {
      if (tool.href) {
        router.push(tool.href);
      } else {
        setSelectedProject(tool);
        setActiveId(tool.id);
      }
    }}
    isActive={selectedProject?.id === tool.id}
    compact
    index={i}
    scrollProgress={scrollYProgress}
    />
   </div>
   ))}
  </div>
  </div>

  <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
 </Section>
 );
}