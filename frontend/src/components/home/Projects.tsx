'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Box } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { Project, ProjectCard } from '../ui/ProjectCard';
import { Section, Heading } from '../ui/Layout';

const staticProjects: Project[] = [
  { id: 2, title: 'پلتفرم راورو', category: 'امنیت سایبری', role: 'طراح ارشد رابط کاربری', desc: 'توسعه پلتفرم باگ‌بانتی با هدف شناسایی شکاف‌های امنیتی توسط هکرهای کلاه سفید در مقیاس ملی.', metrics: [{ label: 'باگ کشف شده', value: '۱K+' }, { label: 'شرکت فعال', value: '۵۰+' }], color: 'rgba(245, 158, 11, 0.3)', borderColor: 'rgba(245, 158, 11, 0.8)', isLocked: false },
  { id: 4, title: 'پیکسل بال', category: 'سرگرمی و بازی', role: 'طراح بازی و صداساز', desc: 'طراحی و توسعه بازی موبایل پیکسلی با تمرکز بر تجربه کاربری رقابتی و صداسازی منحصر به فرد.', metrics: [{ label: 'دانلود فعال', value: '۱۰۰K+' }, { label: 'امتیاز کاربر', value: '۴.۸/۵' }], color: 'rgba(34, 197, 94, 0.3)', borderColor: 'rgba(34, 197, 94, 0.8)', isLocked: false },
  { id: 5, title: 'پلتفرم مالاتا', category: 'تجارت الکترونیک', role: 'بنیان‌گذار فنی و معمار نرم‌افزار', desc: 'اولین بازار آنلاین محصولات تازه دریایی با هدف حذف واسطه‌ها و اتصال مستقیم صیاد به مشتری.', metrics: [{ label: 'فروشنده فعال', value: '۵۰۰+' }, { label: 'رضایت مشتری', value: '۹۵٪' }], color: 'rgba(14, 165, 233, 0.3)', borderColor: 'rgba(14, 165, 233, 0.8)', isLocked: false },
  { id: 8, title: 'دردودل بات', category: 'هوش مصنوعی / Social', role: 'بنیان‌گذار و توسعه‌دهنده', desc: 'پلتفرم هوشمند گفتگو و همدلی ناشناس با محوریت هوش مصنوعی برای ایجاد ارتباطات انسانی عمیق‌تر.', metrics: [{ label: 'کاربر فعال', value: '۲M+' }, { label: 'پیام روزانه', value: '۵M+' }], color: 'rgba(168, 85, 247, 0.4)', borderColor: 'rgba(168, 85, 247, 0.8)', isLocked: false },
  { id: 1, title: 'FIDS و کانتر فرودگاه', category: 'زیرساخت فرودگاهی', role: 'طراح ارشد رابط کاربری', desc: 'طراحی سیستم‌های FIDS و رابط کاربری کانترهای فرودگاه بین‌المللی کیش با استانداردهای نوین بصری.', metrics: [{ label: 'دقت نمایش', value: '۹۹.۹٪' }, { label: 'ترافیک روزانه', value: '۲۰K+' }], color: 'rgba(30, 64, 175, 0.4)', borderColor: 'rgba(30, 64, 175, 0.8)', isLocked: true },
  { id: 3, title: 'پلتفرم درسو', category: 'آموزش آنلاین', role: 'طراح ارشد رابط کاربری', desc: 'طراحی پلتفرم مدرن آموزش از راه دور با تمرکز بر تجربه کاربری بصری و تعامل دانشجو-استاد.', metrics: [{ label: 'دانشجو فعال', value: '۵۰K+' }, { label: 'دوره آموزشی', value: '۲۰۰+' }], color: 'rgba(124, 58, 237, 0.4)', borderColor: 'rgba(124, 58, 237, 0.8)', isLocked: true },
  { id: 6, title: 'پوشیو', category: 'ارتباطات / SaaS', role: 'طراح ارشد رابط کاربری', desc: 'سرویس پوش‌نوتیفیکیشن هوشمند برای وب‌سایت‌ها و اپلیکیشن‌ها با هدف افزایش نرخ بازگشت کاربران.', metrics: [{ label: 'ارسال موفق', value: '۱۰M+', }, { label: 'کسب‌وکار فعال', value: '۲۰۰+', }], color: 'rgba(56, 189, 248, 0.4)', borderColor: 'rgba(56, 189, 248, 0.8)', isLocked: true },
  { id: 7, title: 'باشگاه رویال اقدسیه', category: 'هویت بصری / برندینگ', role: 'طراح ارشد رابط کاربری', desc: 'طراحی هویت دیجیتال و پلتفرم مدیریت مشتریان برای یکی از لوکس‌ترین مجموعه‌های ورزشی کشور.', metrics: [{ label: 'افزایش عضویت', value: '۴۵٪', }, { label: 'رضایت لوکس', value: '۹۸٪', }], color: 'rgba(225, 29, 72, 0.4)', borderColor: 'rgba(225, 29, 72, 0.8)', isLocked: true }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const multiplier = direction === 'left' ? -1 : 1;
      scrollContainerRef.current.scrollBy({
        left: multiplier * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Section id="projects">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <Box className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <Heading subtitle="منتخب">پروژه‌های</Heading>

      <div className="relative">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto -mr-6 pb-20 pl-8 md:pl-48 no-scrollbar relative z-10"
        >
          {staticProjects.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />
          ))}
        </div>
        
        {/* Left Scroll Button */}
        <div 
          className={`absolute left-0 top-0 bottom-20 w-32 md:w-64 bg-gradient-to-r from-black via-black/60 to-transparent z-20 pointer-events-none flex items-center justify-start pl-6 transition-opacity duration-700 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
        >
          <motion.button 
            onClick={() => scroll('left')}
            className="pointer-events-auto"
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </motion.button>
        </div>

        {/* Right Scroll Button */}
        <div 
          className={`absolute right-0 top-0 bottom-20 w-32 md:w-64 bg-gradient-to-l from-black via-black/60 to-transparent z-20 pointer-events-none flex items-center justify-end pr-6 transition-opacity duration-700 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
        >
          <motion.button 
            onClick={() => scroll('right')}
            className="pointer-events-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white rotate-180" />
            </div>
          </motion.button>
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </Section>
  );
}
