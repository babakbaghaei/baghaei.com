'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, UserCircle } from 'lucide-react';
import Logo from '../layout/Logo';

interface ProjectModalProps {
  project: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 lg:p-24">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-3xl cursor-pointer" />
          <motion.div initial={{ opacity: 0, y: 100, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 35 }} className="bg-zinc-950 w-full max-w-6xl h-[85vh] rounded-[3rem] border-2 shadow-2xl relative overflow-hidden flex flex-col" style={{ borderColor: project.borderColor }}>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 blur-[120px] pointer-events-none" style={{ background: project.color }} />
            
            {/* Scrollable Content Container */}
            <div className="overflow-y-auto h-full p-8 md:p-12 lg:p-20 pt-10 custom-scrollbar">
              <div className="flex justify-start mb-12 sticky top-0 z-50">
                <button onClick={onClose} className="flex items-center gap-4 py-3 px-8 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', backdropFilter: 'blur(10px)' }}>
                  <ArrowLeft className="w-4 h-4 text-white rotate-180" />
                  <span className="font-display text-white">بازگشت به پروژه‌ها</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative z-10 pb-20">
              <div className="lg:col-span-8 space-y-16 order-1 md:order-1 text-right">
                <div className="space-y-8">
                  <h2 className="text-6xl md:text-8xl font-bold weight-plus-1 font-display text-white leading-none tracking-tighter">{project.title}</h2>
                  <p className="text-2xl md:text-3xl font-sans text-zinc-400 leading-relaxed">{project.desc}</p>
                </div>

                <div className="prose prose-invert max-w-none">
                  {/* Dedicated Role Section in Modal - Fully RTL */}
                  <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-3xl mb-12 flex items-center gap-6 justify-end text-right">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">مسئولیت من</div>
                      <div className="text-xl font-bold text-white font-display">{project.role}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <UserCircle className="w-8 h-8 text-white opacity-50" />
                    </div>
                  </div>

                  <h4 className="text-xl font-bold font-display text-white mb-6 uppercase tracking-tight text-right">بررسی تخصصی پروژه</h4>
                  <p className="text-lg text-zinc-500 font-sans leading-relaxed mb-10 text-right">این پروژه با تمرکز بر پایداری حداکثری و امنیت لایه‌بندی شده پیاده‌سازی شده است. زیرساختی که نه‌تنها نیازهای امروز، بلکه قابلیت مقیاس‌پذیری برای آینده را نیز دارد.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 backdrop-blur-sm"><div className="font-bold text-white mb-2 font-display text-right">دقت معماری</div><p className="text-sm text-zinc-400 text-right">ساختار توزیع‌شده با قابلیت تحمل خطای بالا و مانیتورینگ بلادرنگ.</p></div>
                    <div className="p-8 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 backdrop-blur-sm"><div className="font-bold text-white mb-2 font-display text-right">تکنولوژی مدرن</div><p className="text-sm text-zinc-400 text-right">بهره‌گیری از فریم‌ورک‌های پیشرو و زیرساخت‌های ابری بهینه شده.</p></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-12 order-2 md:order-2 border-r border-zinc-900 pr-12 lg:pr-24 text-right">
                <div className="space-y-4"><div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Category</div><div className="text-xl font-bold weight-plus-1 font-display text-white uppercase">{project.category}</div></div>
                <div className="space-y-4"><div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Key Metrics</div><div className="grid grid-cols-1 gap-8">{project.metrics.map((metric: any, i: number) => (<div key={i} className="space-y-2"><div className="text-[9px] text-zinc-400 font-bold uppercase">{metric.label}</div><div className="text-3xl font-bold text-white font-en">{metric.value}</div></div>))}</div></div>
                <div className="pt-12"><Logo className="w-16 h-16" /></div>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
