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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12" data-lenis-prevent>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer" 
          />
          
          {/* Expanding Card */}
          <motion.div 
            layoutId={`project-${project.id}`}
            className="bg-zinc-950 w-full max-w-6xl h-[90vh] rounded-[3rem] border border-white/10 shadow-2xl relative flex flex-col z-10" 
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            {/* Ambient Background Glow */}
            <div 
              className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 blur-[120px] pointer-events-none z-0" 
              style={{ background: project.color }} 
            />
            
            {/* Content Container - FORCE INTERNAL SCROLL */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 overflow-y-auto custom-scrollbar relative z-10" 
              dir="ltr"
            >
              <div dir="rtl" className="p-8 md:p-12 lg:p-20 pt-10">
                {/* Header Controls */}
                <div className="flex justify-between items-center mb-12 sticky top-0 z-50">
                  <Button 
                    variant="outline"
                    onClick={onClose}
                    leftIcon={<ArrowLeft className="w-4 h-4 rotate-180" />}
                    className="!bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    بازگشت
                  </Button>
                  
                  <button 
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative z-10 pb-20">
                  {/* Main Content Area */}
                  <div className="lg:col-span-8 space-y-12 text-right">
                    <div className="space-y-6">
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] font-display"
                      >
                        {project.category}
                      </motion.div>
                      <h2 className="text-5xl md:text-7xl font-bold weight-plus-1 font-display text-white leading-tight tracking-tighter">
                        {project.title}
                      </h2>
                      <p className="text-xl md:text-2xl font-sans text-zinc-400 leading-relaxed max-w-3xl">
                        {project.desc}
                      </p>
                    </div>

                    {/* Role Highlight */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 justify-end text-right">
                      <div className="flex-1">
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 font-display">مسئولیت من</div>
                        <div className="text-xl font-bold text-white font-display">{project.role}</div>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                        <UserCircle className="w-8 h-8 text-white opacity-40" />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h4 className="text-xl font-bold font-display text-white uppercase tracking-tight">بررسی تخصصی پروژه</h4>
                      <p className="text-lg text-zinc-500 font-sans leading-relaxed text-justify">
                        این پروژه با تمرکز بر پایداری حداکثری و امنیت لایه‌بندی شده پیاده‌سازی شده است. 
                        معماری سیستم به گونه‌ای طراحی شده که نه‌تنها نیازهای عملیاتی فعلی را با دقت ۱۰۰٪ پوشش می‌دهد، 
                        بلکه قابلیت مقیاس‌پذیری عمودی و افقی برای میزبانی میلیون‌ها درخواست در لحظه را داراست.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-10 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 group hover:bg-zinc-900/60 transition-colors">
                          <div className="font-bold text-white mb-3 font-display text-xl text-right">دقت مهندسی</div>
                          <p className="text-zinc-400 text-right leading-relaxed">استفاده از الگوریتم‌های بهینه برای کاهش تاخیر و افزایش نرخ پاسخ‌دهی سیستم در شرایط بحرانی.</p>
                        </div>
                        <div className="p-10 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 group hover:bg-zinc-900/60 transition-colors">
                          <div className="font-bold text-white mb-3 font-display text-xl text-right">طراحی متمرکز</div>
                          <p className="text-zinc-400 text-right leading-relaxed">رابط کاربری با تمرکز بر کاهش خطای انسانی و افزایش سرعت دسترسی به اطلاعات حیاتی.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Info Area */}
                  <div className="lg:col-span-4 space-y-12 border-r border-white/5 pr-12 lg:pr-16 text-right">
                    <div className="space-y-6">
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] font-display">Key Metrics</div>
                      <div className="space-y-10">
                        {project.metrics.map((metric, i) => (
                          <div key={i} className="space-y-2">
                            <div className="text-[9px] text-zinc-500 font-black uppercase font-display tracking-widest">{metric.label}</div>
                            <div className="text-4xl font-bold text-white font-display leading-none">{formatMetric(metric.value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies in Modal */}
                    {project.tech && (
                      <div className="space-y-6">
                        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] font-display">Technologies</div>
                        <div className="flex flex-wrap gap-3 justify-start">
                          {project.tech.map((t, i) => (
                            <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                              {t}
                              <TechIcon name={t} />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-12 flex flex-col items-end gap-6">
                      <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] font-display">Crafted by</div>
                      <Logo className="w-16 h-16 text-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}