'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { Project, ProjectCard } from '../ui/ProjectCard';
import { Section, Heading } from '../ui/Layout';
import { ArrowLeft, Box, PenTool, Keyboard, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Selected High-Impact Projects for the Top Slider
const SELECTED_PROJECTS: Project[] = [
  { 
    id: 2, 
    title: 'پلتفرم راورو', 
    category: 'امنیت سایبری', 
    role: 'طراح ارشد رابط کاربری', 
    desc: 'توسعه پلتفرم باگ‌بانتی با هدف شناسایی شکاف‌های امنیتی توسط هکرهای کلاه سفید در مقیاس ملی.', 
    metrics: [{ label: 'باگ کشف شده', value: '۱K+' }, { label: 'شرکت فعال', value: '۵۰+' }], 
    color: 'rgba(245, 158, 11, 0.2)', 
    borderColor: 'rgba(245, 158, 11, 0.8)', 
    isLocked: false,
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker']
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
  },
  { 
    id: 1, 
    title: 'FIDS فرودگاه کیش', 
    category: 'زیرساخت فرودگاهی', 
    role: 'طراح ارشد رابط کاربری', 
    desc: 'طراحی سیستم‌های نمایش اطلاعات پرواز و رابط کاربری کانترهای فرودگاه بین‌المللی کیش.', 
    metrics: [{ label: 'دقت نمایش', value: '۹۹.۹٪' }, { label: 'ترافیک روزانه', value: '۲۰K+' }], 
    color: 'rgba(30, 64, 175, 0.2)', 
    borderColor: 'rgba(30, 64, 175, 0.8)', 
    isLocked: false,
    tech: ['C++', 'Qt', 'WebSockets', 'Linux']
  },
  { 
    id: 9, 
    title: 'تیونینگ کیوانی', 
    category: 'خودرو / لوکس', 
    role: 'معمار نرم‌افزار', 
    desc: 'طراحی پلتفرم اختصاصی و سیستم پیکربندی خودروهای فوق‌لوکس برای برند جهانی Kevany.', 
    metrics: [{ label: 'خودرو اختصاصی', value: '۱۰۰+' }, { label: 'بازدید جهانی', value: '۱M+' }], 
    color: 'rgba(153, 27, 27, 0.3)', 
    borderColor: 'rgba(153, 27, 27, 0.8)', 
    isLocked: false,
    tech: ['WebGL', 'Three.js', 'React', 'Next.js']
  }
];

// Tools & Apps for the Grid
const TOOLS_DATA: Project[] = [
  { 
    id: 10, 
    title: 'پلتفرم کولک', 
    category: 'زیرساخت / SaaS', 
    role: 'معمار ارشد سیستم', 
    desc: 'توسعه زیرساخت‌های مقیاس‌پذیر و راهکارهای نوین ابری برای کسب‌وکارهای در حال رشد.', 
    metrics: [], 
    color: 'rgba(34, 197, 94, 0.2)', 
    borderColor: 'rgba(34, 197, 94, 0.8)', 
    isLocked: false,
    tech: ['Next.js', 'Go', 'Docker']
  },
  { 
    id: 11, 
    title: 'بازی تخت نرد', 
    category: 'سرگرمی / Game', 
    role: 'توسعه‌دهنده بازی', 
    desc: 'طراحی و پیاده‌سازی بازی کلاسیک تخت نرد با فیزیک واقعی و قابلیت بازی آنلاین بلادرنگ.', 
    metrics: [], 
    color: 'rgba(120, 67, 40, 0.2)', 
    borderColor: 'rgba(120, 67, 40, 0.8)', 
    isLocked: false,
    tech: ['Unity', 'C#', 'WebSockets']
  },
  { 
    id: 12, 
    title: 'اسپات لایت', 
    category: 'گردشگری / هوشمند', 
    role: 'معمار نرم‌افزار', 
    desc: 'پلتفرم مدیریت هوشمند تورهای گردشگری با قابلیت ردیابی لحظه‌ای لیدرها.', 
    metrics: [], 
    color: 'rgba(20, 83, 45, 0.2)', 
    borderColor: 'rgba(20, 83, 45, 0.8)', 
    isLocked: false,
    tech: ['Node.js', 'Redis', 'GPS-API']
  },
  { 
    id: 14, 
    title: 'لایف کوچ اوج', 
    category: 'سلامت / مربیگری', 
    role: 'توسعه‌دهنده ارشد', 
    desc: 'پلتفرم اختصاصی اتصال مربیان حرفه‌ای به مراجعین با ابزارهای مدیریت جلسات.', 
    metrics: [], 
    color: 'rgba(254, 243, 199, 0.15)', 
    borderColor: 'rgba(254, 243, 199, 0.8)', 
    isLocked: false,
    tech: ['Next.js', 'FastAPI', 'WebRTC']
  },
  { 
    id: 13, 
    title: 'پروژه رشد', 
    category: 'توسعه فردی', 
    role: 'مدیر فنی', 
    desc: 'سیستم جامع مدیریت یادگیری و رهگیری شاخص‌های رشد فردی و سازمانی.', 
    metrics: [], 
    color: 'rgba(139, 92, 246, 0.2)', 
    borderColor: 'rgba(139, 92, 246, 0.8)', 
    isLocked: false,
    tech: ['React', 'PostgreSQL', 'Prisma']
  },
  {
    id: 101,
    title: 'دستیار چک‌نویس',
    category: 'ابزار مالی',
    role: 'تبدیل عدد به حروف',
    desc: 'مبدل هوشمند و دقیق عدد به حروف فارسی جهت نوشتن آسان چک‌های صیادی.',
    metrics: [],
    color: 'rgba(99, 102, 241, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.8)',
    isLocked: false,
    href: '/tools/cheque-nevis',
    tech: ['React']
  },
  {
    id: 102,
    title: 'تایپِ جنگی',
    category: 'سرگرمی',
    role: 'تست سرعت تایپ',
    desc: 'سنجش سرعت و دقت تایپ فارسی با چالش‌های هیجان‌انگیز.',
    metrics: [],
    color: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.8)',
    isLocked: false,
    href: '/tools/type-jangi',
    tech: ['React']
  },
  {
    id: 103,
    title: 'چرخونه تصمیم',
    category: 'ابزار کمکی',
    role: 'تصمیم‌گیری شانس',
    desc: 'ابزاری مدرن برای حل تردیدها و تصمیم‌گیری‌های سخت با چرخونه شانس.',
    metrics: [],
    color: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.8)',
    isLocked: false,
    href: '/tools/spin-win',
    tech: ['Framer Motion']
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
 <Section id="projects" sectionRef={sectionRef} className="border-t border-border overflow-visible !pb-fib-55 bg-transparent">
  <motion.div style={{ y: bgY }} className="absolute top-0 right-0 -mr-fib-34 -mt-fib-34 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
  <Box className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
  </motion.div>

  <Heading subtitle="منتخب">پروژه‌های</Heading>

  <div className="relative group/projects-container mb-fib-34 -mr-fib-5 md:-mr-fib-8">
  <div className={`absolute inset-y-0 right-0 w-fib-55 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
  <div className={`absolute inset-y-0 left-0 w-fib-55 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />

  <div ref={scrollContainerRef} onScroll={handleScroll} className="flex overflow-x-auto pb-20 no-scrollbar relative z-10 gap-0">
   {SELECTED_PROJECTS.map((p) => (
   <div key={p.id} className="w-[280px] md:w-[320px] h-[420px] md:h-[480px] shrink-0 relative" style={{ zIndex: activeId === p.id ? 50 : 1 }}>
    <ProjectCard project={p} onClick={() => { setSelectedProject(p); setActiveId(p.id); }} isActive={selectedProject?.id === p.id} />
   </div>
   ))}
  </div>
  </div>

  <div className="w-full mt-24 mb-0 relative z-10">
  <div className="flex items-center gap-6 mb-12 opacity-50 px-1 md:px-2">
   <div className="h-[1px] bg-border flex-1" />
   <h4 className="text-muted-foreground font-display text-xs md:text-sm uppercase font-bold">ابزارها و اپلیکیشن‌ها</h4>
   <div className="h-[1px] bg-border flex-1" />
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
   {TOOLS_DATA.map(tool => (
   <div key={tool.id} className="h-32 relative" style={{ zIndex: activeId === tool.id ? 50 : 1 }}>
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
    horizontal
    />
   </div>
   ))}
  </div>
  </div>

  <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
 </Section>
 );
}
