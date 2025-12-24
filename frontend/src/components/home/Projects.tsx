"use client";
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, Hammer, Box } from 'lucide-react';
import ProjectModal from './ProjectModal';

interface Metric {
  label: string;
  value: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  role: string;
  desc: string;
  metrics: Metric[];
  color: string;
  borderColor: string;
  isLocked: boolean;
}

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

function ProjectCard({ project, onClick }: { project: any, onClick: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXPos = useMotionValue(0);
  const mouseYPos = useMotionValue(0);
  
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 25 });
  const scale = useSpring(isHovered ? 1.02 : 1, { stiffness: 150, damping: 25 });

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cardX = e.clientX - rect.left;
    const cardY = e.clientY - rect.top;
    
    mouseXPos.set(cardX);
    mouseYPos.set(cardY);

    if (isHovered) {
      x.set(cardX / rect.width - 0.5);
      y.set(cardY / rect.height - 0.5);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleGlobalMouseMove}
      onMouseEnter={() => setIsNear(true)}
      onMouseLeave={() => {
        setIsNear(false);
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      className="shrink-0 w-[350px] md:w-[450px] relative p-6"
      style={{ perspective: "1500px" }}
    >
      <motion.div
        onClick={project.isLocked ? undefined : onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          rotateX, 
          rotateY, 
          scale, 
          transformStyle: "preserve-3d" 
        }}
        className={`project-card group relative flex flex-col h-[550px] p-8 md:p-12 shadow-sm hover:shadow-2xl transition-[background-color,border-color] duration-500 overflow-visible z-10 ${project.isLocked ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[3rem] pointer-events-none">
          <motion.div 
            animate={{ opacity: isHovered ? 0.6 : 0 }} 
            style={{ 
              left: mouseXPos, 
              top: mouseYPos, 
              background: `radial-gradient(circle at center, ${project.color} 0%, transparent 80%)`
            }} 
            className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 blur-[60px]" 
          />
        </div>

        <motion.div 
          className="absolute inset-0 z-30 pointer-events-none rounded-[3rem] p-[2px]"
          animate={{ opacity: isNear ? (isHovered ? 1 : 0.4) : 0 }}
          style={{
            background: useTransform([mouseXPos, mouseYPos], ([cx, cy]: any) => `radial-gradient(250px circle at ${cx}px ${cy}px, ${project.borderColor}, transparent 80%)`),
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude',
          }}
        />

        {project.isLocked && (
          <div className="absolute inset-0 z-40 bg-black/60 flex items-center justify-center flex-col gap-4 rounded-[3rem] overflow-hidden text-center p-6">
            <motion.div 
              style={{
                background: useTransform([mouseXPos, mouseYPos], ([cx, cy]: any) => `radial-gradient(100px circle at ${cx}px ${cy}px, rgba(255,255,255,0.2), transparent 100%)`),
              }}
              className="absolute inset-0 pointer-events-none"
            />
            <motion.div 
              style={{ transform: "translateZ(50px)" }}
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -10, 10, 0] : 0
              }}
              className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center relative z-10"
            >
              <Hammer className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-[10px] font-black text-white uppercase relative z-10 font-display">در حال توسعه</span>
          </div>
        )}

        <div className="flex-1 flex flex-col h-full relative z-10 pointer-events-none text-right" style={{ transformStyle: "preserve-3d" }}>
          <div style={{ transform: "translateZ(80px)", transformStyle: "preserve-3d" }} className="space-y-4">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">{project.category}</div>
            <h3 className="text-3xl md:text-4xl font-bold weight-plus-1 font-display text-white leading-tight">{project.title}</h3>
            <div className="mt-4 inline-flex items-center gap-2 text-zinc-500 text-[10px] font-bold">
              <div className="w-1 h-1 bg-zinc-500 rounded-full" />
              <span>مسئولیت: {project.role}</span>
            </div>
          </div>

          <div style={{ 
            transform: "translateZ(40px)", 
            maskImage: project.isLocked ? 'linear-gradient(to bottom, black 0%, transparent 90%)' : 'none',
            filter: project.isLocked ? 'blur(4px)' : 'none' // Added gentle blur to the text area
          }}>
            <p className="text-zinc-500 font-sans leading-relaxed text-base mt-8 line-clamp-3">{project.desc}</p>
          </div>
          
          <div style={{ 
            transform: "translateZ(20px)", 
            opacity: project.isLocked ? 0.2 : 1,
            filter: project.isLocked ? 'blur(8px)' : 'none' // Stronger blur for metrics
          }} className="grid grid-cols-2 gap-8 pt-10 border-t border-zinc-800 mt-auto">
            {project.metrics.map((m: any, i: number) => (
              <div key={i}>
                <div className="text-[9px] text-zinc-400 uppercase font-bold mb-1">{m.label}</div>
                <div className="text-2xl font-bold font-display text-white">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {!project.isLocked && (
          <div style={{ transform: "translateZ(30px)" }} className="mt-8 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest relative z-10 text-white">
            <span>مشاهده جزئیات</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        )}
      </motion.div>
    </div>
  );
}

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
      // In RTL, moving 'left' means decreasing scrollLeft (more negative)
      // Moving 'right' means increasing scrollLeft (towards 0)
      const multiplier = direction === 'left' ? -1 : 1;
      scrollContainerRef.current.scrollBy({
        left: multiplier * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="projects" className="py-40 relative overflow-hidden transition-colors duration-700">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <Box className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 mb-24 relative z-10 text-right">
        <div className="w-12 h-[2px] bg-white mb-8 mr-0 ml-auto" />
        <h2 className="text-6xl md:text-8xl font-bold weight-plus-1 font-display text-white leading-[0.8] uppercase text-right">
          پروژه‌های <br /><span className="text-zinc-800">منتخب.</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto -mr-6 pb-20 pl-8 md:pl-48 no-scrollbar relative z-10"
        >
          {staticProjects.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />
          ))}
        </div>
        
        {/* Left Scroll Button (Forward in RTL) */}
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

        {/* Right Scroll Button (Backward in RTL) */}
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
    </section>
  );
}