'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, Hammer } from 'lucide-react';
import { formatMetric } from '@/lib/utils/format';
import TextDecrypt from '@/components/effects/TextDecrypt';

export interface Metric {
  label: string;
  value: string;
}

export interface Project {
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

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
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
        className={`project-card group relative flex flex-col h-[550px] p-8 md:p-12 shadow-sm hover:shadow-2xl transition-[background-color] duration-500 overflow-visible z-10 ${project.isLocked ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {/* Borders Layer - Perfectly Aligned */}
        <div className="absolute inset-0 pointer-events-none z-30 rounded-[3rem]">
          {/* Base Static Border */}
          <div className="absolute inset-0 border border-white/10 rounded-[3rem]" />
          
          {/* Reactive Hover Border */}
          <motion.div 
            className="absolute inset-0 rounded-[3rem] p-[1px]"
            animate={{ opacity: isNear ? (isHovered ? 1 : 0.4) : 0 }}
            style={{
              background: useTransform([mouseXPos, mouseYPos], ([cx, cy]: any) => `radial-gradient(250px circle at ${cx}px ${cy}px, ${project.isLocked ? 'rgba(255,255,255,0.6)' : project.borderColor}, transparent 80%)`),
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
              WebkitMaskComposite: 'xor', 
              maskComposite: 'exclude',
              filter: project.isLocked ? 'grayscale(1)' : 'none'
            }}
          />
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[3rem] pointer-events-none">

        {/* Locked Overlay */}
        {project.isLocked && (
          <div className="absolute inset-0 z-40 bg-black/60 flex items-center justify-center flex-col gap-4 rounded-[3rem] overflow-hidden text-center p-6">
            <motion.div 
              style={{
                background: useTransform([mouseXPos, mouseYPos], ([cx, cy]: any) => `radial-gradient(150px circle at ${cx}px ${cy}px, rgba(255,255,255,0.15), transparent 100%)`),
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
            <div className={`text-[10px] font-bold text-zinc-400 uppercase font-display ${project.isLocked ? 'blur-sm' : ''}`}>{project.category}</div>
            <h3 className="text-3xl md:text-4xl font-bold weight-plus-1 font-display text-white leading-tight">
              {project.title}
            </h3>
            <div className={`mt-4 inline-flex items-center gap-2 text-zinc-500 text-[10px] font-bold font-display ${project.isLocked ? 'blur-sm' : ''}`}>
              <div className="w-1 h-1 bg-zinc-500 rounded-full" />
              <span>مسئولیت: {project.role}</span>
            </div>
          </div>

          <div style={{ 
            transform: "translateZ(40px)", 
            maskImage: project.isLocked ? 'linear-gradient(to bottom, black 0%, transparent 90%)' : 'none',
            filter: project.isLocked ? 'blur(4px)' : 'none' 
          }}>
            <p className="text-zinc-500 font-sans leading-relaxed text-base mt-8 line-clamp-3">
              {project.desc}
            </p>
          </div>
          
          <div style={{ 
            transform: "translateZ(20px)", 
            opacity: project.isLocked ? 0.2 : 1,
            filter: project.isLocked ? 'blur(8px)' : 'none'
          }} className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5 mt-auto">
            {project.metrics.map((m, i) => (
              <div key={i}>
                <div className="text-[9px] text-zinc-400 uppercase font-black font-display mb-1">{m.label}</div>
                <div className="text-2xl font-bold font-display text-white">{formatMetric(m.value)}</div>
              </div>
            ))}
          </div>
        </div>
        
        {!project.isLocked && (
          <div style={{ transform: "translateZ(30px)" }} className="mt-8 flex items-center gap-4 text-[10px] font-black font-display uppercase tracking-widest relative z-10 text-white">
            <span>مشاهده جزئیات</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        )}
      </motion.div>
    </div>
  );
};
