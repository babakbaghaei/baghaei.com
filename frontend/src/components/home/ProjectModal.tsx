'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 ArrowLeft, 
 UserCircle, 
 X, 
 Code2, 
 Database, 
 Cpu, 
 Server, 
 Layers, 
 Shield, 
 Smartphone,
 Layout,
 Terminal,
 Box,
 Braces
} from 'lucide-react';
import Logo from '../layout/Logo';
import { Project } from '../ui/ProjectCard';
import { formatMetric } from '@/lib/utils/format';
import { Button } from '../ui/Button';

interface ProjectModalProps {
 project: Project | null;
 isOpen: boolean;
 onClose: () => void;
}

const TechIcon = ({ name }: { name: string }) => {
 const n = name.toLowerCase();
 if (n.includes('react') || n.includes('next')) return <Code2 className="w-4 h-4" />;
 if (n.includes('node') || n.includes('go') || n.includes('python') || n.includes('fastapi')) return <Terminal className="w-4 h-4" />;
 if (n.includes('postgresql') || n.includes('sql') || n.includes('mongo') || n.includes('redis')) return <Database className="w-4 h-4" />;
 if (n.includes('docker') || n.includes('k8s') || n.includes('kubern')) return <Box className="w-4 h-4" />;
 if (n.includes('ai') || n.includes('llm') || n.includes('torch')) return <Cpu className="w-4 h-4" />;
 if (n.includes('aws') || n.includes('cloud')) return <Server className="w-4 h-4" />;
 if (n.includes('security') || n.includes('امنیت')) return <Shield className="w-4 h-4" />;
 if (n.includes('android') || n.includes('ios') || n.includes('mobile')) return <Smartphone className="w-4 h-4" />;
 if (n.includes('webgl') || n.includes('three')) return <Layers className="w-4 h-4" />;
 if (n.includes('branding') || n.includes('ui')) return <Layout className="w-4 h-4" />;
 return <Braces className="w-4 h-4" />;
};

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
 useEffect(() => {
  if (isOpen) {
   const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
   document.body.style.overflow = 'hidden';
   document.body.style.paddingRight = `${scrollBarWidth}px`;
   document.body.classList.add('lenis-stopped');
  } else {
   document.body.style.overflow = '';
   document.body.style.paddingRight = '';
   document.body.classList.remove('lenis-stopped');
  }
  return () => {
   document.body.style.overflow = '';
   document.body.style.paddingRight = '';
   document.body.classList.remove('lenis-stopped');
  };
 }, [isOpen]);

 if (!project) return null;

 return (
  <AnimatePresence>
   {isOpen && (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-0 md:p-12" data-lenis-prevent>
     {/* Backdrop */}
     <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      onClick={onClose} 
      className="absolute inset-0 bg-background/90 backdrop-blur-xl cursor-pointer" 
     />
     
     {/* Expanding Card */}
     <motion.div 
      layoutId={`project-${project.id}`}
      className="w-full max-w-6xl h-full md:h-[85vh] md:rounded-[3rem] border-x border-border md:border shadow-2xl relative flex flex-col z-10 overflow-hidden bg-card" 
      style={{ 
       transformStyle: "preserve-3d",
       willChange: 'transform, opacity'
      }}
      transition={{ 
       type: 'spring', 
       stiffness: 200, 
       damping: 30, 
       mass: 0.8
      }}
     >
      {/* Background Polish */}
      <div 
       className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
       style={{ backgroundColor: project.color }}
      />
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10" dir="ltr">
       <div dir="rtl" className="p-6 md:p-12 lg:p-20">
        {/* Top Controls */}
        <div className="flex justify-start items-center mb-16 sticky top-0 bg-card/80 backdrop-blur-md py-4 z-50 rounded-2xl">
         <button 
          onClick={onClose}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary border border-border flex items-center justify-center hover:scale-110 transition-transform"
         >
          <X className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
         </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
         {/* Right: Textual Info */}
         <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest font-display"
           >
            {project.role}
           </motion.div>
           <h2 className="text-5xl md:text-8xl font-black font-display text-foreground leading-tight tracking-tighter">
            {project.title}
           </h2>
           <p className="text-xl md:text-2xl font-sans text-muted-foreground leading-relaxed max-w-3xl">
            {project.desc}
           </p>
          </div>

          {/* App Store Style Screenshot Gallery - MOVED HERE */}
          <div className="pt-4 space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-black font-display text-foreground">پیش‌نمایش محیط کاربری</h4>
              <div className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">Scroll to explore →</div>
            </div>
            
            <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth">
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-none w-[280px] md:w-[350px] aspect-[16/10] rounded-[2rem] bg-secondary/50 border border-border/50 relative overflow-hidden group/img"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent z-0" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-white/5 uppercase tracking-widest">Screenshot_{i + 1}</span>
                  </div>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Core Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-border">
           <div className="p-8 bg-secondary/20 backdrop-blur-md rounded-[2.5rem] border border-border/50">
            <h4 className="font-black text-xl mb-4 font-display">مسئولیت اجرایی</h4>
            <p className="text-foreground/70 leading-relaxed">{project.role}</p>
           </div>
           <div className="p-8 bg-secondary/20 backdrop-blur-md rounded-[2.5rem] border border-border/50">
            <h4 className="font-black text-xl mb-4 font-display">دستاورد کلیدی</h4>
            <p className="text-foreground/70 leading-relaxed">بهینه‌سازی حداکثری فرآیندهای عملیاتی و ارتقای سطح پایداری سیستم در مقیاس بالا.</p>
           </div>
          </div>
         </div>

         {/* Left: Metadata Sidebar */}
         <div className="lg:col-span-4 space-y-12 lg:border-r lg:border-border lg:pr-12">
          <div className="space-y-10">
           {project.metrics.map((metric, i) => (
            <div key={i} className="space-y-2">
             <div className="text-[10px] text-muted-foreground font-black uppercase font-display tracking-widest">{metric.label}</div>
             <div className="text-5xl font-black text-foreground font-display leading-none">{formatMetric(metric.value)}</div>
            </div>
           ))}
          </div>

          <div className="pt-12 border-t border-border">
           <div className="text-[10px] font-black text-muted-foreground uppercase font-display mb-6">تکنولوژی‌های کلیدی</div>
           <div className="flex flex-wrap gap-2">
            {project.tech?.map((t, i) => (
             <span key={i} className="px-4 py-2 rounded-xl bg-secondary border border-border text-[10px] font-bold text-foreground flex items-center gap-2">
              <TechIcon name={t} />
              {t}
             </span>
            ))}
           </div>
          </div>
          
          <div className="pt-12 opacity-30">
           <Logo className="w-12 h-12" />
          </div>
         </div>
        </div>
       </div>
      </div>
     </motion.div>
    </div>
   )}
  </AnimatePresence>
 );
}