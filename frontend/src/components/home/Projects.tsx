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
  }
];

export default function Projects() {
 const router = useRouter();
 const [selectedProject, setSelectedProject] = useState<Project | null>(null);
 const [activeId, setActiveId] = useState<number | null>(null);
 const scrollContainerRef = useRef<HTMLDivElement>(null);
 
 const { scrollYProgress } = useScroll();
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
 <Section id="projects" className="border-t border-border overflow-visible !pb-20">
  <motion.div style={{ y: bgY }} className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
  <Box className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
  </motion.div>

  <Heading subtitle="منتخب">پروژه‌های</Heading>

  <div className="relative group/projects-container mb-12 -mr-2 md:-mr-4">
  {/* Scroller Fades */}
  <div 
   className={`absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} 
  />
  <div 
   className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} 
  />

  <div 
   ref={scrollContainerRef}
   onScroll={handleScroll}
   className="flex overflow-x-auto pb-20 no-scrollbar relative z-10 gap-0"
  >
   {PROJECTS_DATA.map((p) => (
   <div 
    key={p.id} 
    className="w-[280px] md:w-[320px] h-[420px] md:h-[480px] shrink-0 relative"
    style={{ zIndex: activeId === p.id ? 50 : 1 }}
   >
    <ProjectCard 
    project={p} 
    onClick={() => { setSelectedProject(p); setActiveId(p.id); }}
    isActive={selectedProject?.id === p.id}
    />
   </div>
   ))}
  </div>
  </div>

  {/* Tools Section */}
  <div className="w-full mt-0 mb-0 relative z-10 -mx-1 md:-mx-2">
  <div className="flex items-center gap-6 mb-12 opacity-50 px-1 md:px-2">
   <div className="h-[1px] bg-border flex-1" />
   <h4 className="text-muted-foreground font-display text-xs md:text-sm uppercase font-bold">ابزارها</h4>
   <div className="h-[1px] bg-border flex-1" />
  </div>
  
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
   {TOOLS_DATA.map(tool => (
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
    />
   </div>
   ))}
  </div>
  </div>

  <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
 </Section>
 );
}