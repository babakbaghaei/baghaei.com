'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useInView } from 'framer-motion';
import { 
  ArrowLeft, 
  Hammer, 
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
import { formatMetric } from '@/lib/utils/format';
import { useSound } from '@/lib/utils/sounds';
import Magnetic from '@/components/effects/Magnetic';

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
  tech?: string[];
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const TechIcon = ({ name }: { name: string }) => {
  const n = name.toLowerCase();
  if (n.includes('react') || n.includes('next')) return <Code2 className="w-3 h-3" />;
  if (n.includes('node') || n.includes('go') || n.includes('python') || n.includes('fastapi')) return <Terminal className="w-3 h-3" />;
  if (n.includes('postgresql') || n.includes('sql') || n.includes('mongo') || n.includes('redis')) return <Database className="w-3 h-3" />;
  if (n.includes('docker') || n.includes('k8s') || n.includes('kubern')) return <Box className="w-3 h-3" />;
  if (n.includes('ai') || n.includes('llm') || n.includes('torch')) return <Cpu className="w-3 h-3" />;
  if (n.includes('aws') || n.includes('cloud')) return <Server className="w-3 h-3" />;
  if (n.includes('security') || n.includes('امنیت')) return <Shield className="w-3 h-3" />;
  if (n.includes('android') || n.includes('ios') || n.includes('mobile')) return <Smartphone className="w-3 h-3" />;
  if (n.includes('webgl') || n.includes('three')) return <Layers className="w-3 h-3" />;
  if (n.includes('branding') || n.includes('ui')) return <Layout className="w-3 h-3" />;
  return <Braces className="w-3 h-3" />;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const { play } = useSound();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const isInView = useInView(containerRef, { margin: "200px" });
  
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { stiffness: 60, damping: 20 };
  const tiltX = useSpring(0, springConfig);
  const tiltY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  
  const innerGlowOpacity = useSpring(0, { stiffness: 40, damping: 20 });
  const borderOpacity = useSpring(0, { stiffness: 40, damping: 20 });

  const rotateX = useTransform(tiltY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (!isInView) return;
    innerGlowOpacity.set(isHovered && !project.isLocked && !isTouchDevice ? 0.8 : 0);
    scale.set(isHovered && !project.isLocked ? 1.02 : 1);
    if (!isHovered || project.isLocked || isTouchDevice) {
      tiltX.set(0);
      tiltY.set(0);
    }
  }, [isHovered, project.isLocked, isInView, isTouchDevice]);

  useEffect(() => {
    if (!isInView || isTouchDevice) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = rectRef.current || containerRef.current.getBoundingClientRect();
      if (!rectRef.current) rectRef.current = rect;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseX.set(x);
      mouseY.set(y);

      if (!project.isLocked) {
        const distToX = Math.max(0, -x, x - rect.width);
        const distToY = Math.max(0, -y, y - rect.height);
        const distance = Math.sqrt(distToX * distToX + distToY * distToY);
        borderOpacity.set(Math.max(0, 1 - distance / 250));

        if (isHovered) {
          tiltX.set(x / rect.width - 0.5);
          tiltY.set(y / rect.height - 0.5);
        }
      }
    };

    const updateRect = () => {
      if (containerRef.current) rectRef.current = containerRef.current.getBoundingClientRect();
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('resize', updateRect);
    };
  }, [isHovered, project.isLocked, isInView, isTouchDevice]);

  return (
    <div 
      ref={containerRef}
      className="shrink-0 w-[320px] md:w-[450px] relative p-4 md:p-8 select-none"
      style={{ perspective: "2000px" }}
    >
      <motion.div
        layoutId={`project-${project.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={project.isLocked ? undefined : onClick}
        style={{ 
          rotateX: isTouchDevice ? 0 : rotateX, 
          rotateY: isTouchDevice ? 0 : rotateY, 
          scale, 
          transformStyle: "preserve-3d",
          willChange: isHovered ? "transform" : "auto"
        }}
        className={`project-card group relative flex flex-col h-[550px] md:h-[600px] w-full z-10 ${project.isLocked ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {/* 1. Clipping Background Layer */}
        <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden z-0">
          {!isTouchDevice && (
            <motion.div 
              style={{
                opacity: innerGlowOpacity,
                left: mouseX,
                top: mouseY,
                background: `radial-gradient(circle at center, ${project.color} 0%, transparent 70%)`,
              }}
              className="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none" 
            />
          )}
          
          {/* Border Glow */}
          {!isTouchDevice && (
            <motion.div 
              className="absolute inset-0 p-[2px] pointer-events-none rounded-[2.5rem] md:rounded-[3rem]"
              style={{
                opacity: borderOpacity,
                background: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, ${project.borderColor}, transparent 80%)`,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                WebkitMaskComposite: 'xor', 
                maskComposite: 'exclude',
              }}
            />
          )}
        </div>

        {/* 2. Full Content Layer (Inside Card) */}
        <div className="flex-1 flex flex-col h-full relative z-10 p-8 md:p-12 pointer-events-none text-right" style={{ 
          transformStyle: "preserve-3d",
          opacity: project.isLocked ? 0.4 : 1,
          filter: project.isLocked ? 'blur(6px)' : 'none'
        }}>
          <div style={{ transform: isTouchDevice ? "none" : "translateZ(100px)" }} className="space-y-3 md:space-y-4">
            <div className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase font-display tracking-normal">{project.category}</div>
            <h3 className="text-2xl md:text-4xl font-bold font-display text-white leading-tight">{project.title}</h3>
            <div className="mt-2 md:mt-4 inline-flex items-center gap-2 text-zinc-500 text-[9px] md:text-[10px] font-bold font-display tracking-normal">
              <div className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span>{project.role}</span>
            </div>
          </div>

          <div style={{ transform: isTouchDevice ? "none" : "translateZ(60px)" }} className="mt-6 md:mt-8">
            <p className="text-zinc-500 font-sans leading-relaxed text-sm md:text-base line-clamp-3">{project.desc}</p>
          </div>

          {project.tech && (
            <div style={{ transform: isTouchDevice ? "none" : "translateZ(50px)" }} className="flex flex-wrap gap-1.5 md:gap-2 mt-4 md:mt-6 justify-start">
              {project.tech.map((t, i) => (
                <span key={i} className="px-2.5 md:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[7px] md:text-[8px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  {t}
                  <TechIcon name={t} />
                </span>
              ))}
            </div>
          )}
          
          <div style={{ transform: isTouchDevice ? "none" : "translateZ(40px)" }} className="grid grid-cols-2 gap-4 md:gap-8 pt-8 md:pt-10 border-t border-white/5 mt-auto">
            {project.metrics.map((m, i) => (
              <div key={i} style={{ transformStyle: "preserve-3d" }}>
                <div className="text-[8px] md:text-[9px] text-zinc-600 uppercase font-bold font-display mb-1 tracking-wider">{m.label}</div>
                <div className="text-xl md:text-2xl font-bold font-display text-white" style={{ transform: isTouchDevice ? "none" : "translateZ(20px)" }}>{formatMetric(m.value)}</div>
              </div>
            ))}
          </div>

          {/* 3. Button (Inside Content Layer, bottom part) */}
          {!project.isLocked && (
            <div style={{ transform: isTouchDevice ? "none" : "translateZ(80px)" }} className="mt-8 md:mt-10">
              <Magnetic intensity={isTouchDevice ? 0 : 0.2}>
                <div 
                  className="inline-flex items-center gap-3 px-5 md:px-6 py-2 md:py-2.5 rounded-full border border-white/10 bg-white/5 text-white group-hover:bg-white group-hover:!text-black transition-all duration-500 cursor-pointer text-[9px] md:text-[10px] font-bold font-display uppercase pointer-events-auto" 
                  onClick={(e) => { e.stopPropagation(); play('pop'); onClick(); }}
                  onMouseEnter={() => !isTouchDevice && play('hover')}
                >
                  <span className="!text-inherit">مشاهده جزئیات</span>
                  <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 !text-inherit transition-all duration-500 group-hover:-translate-x-1" />
                </div>
              </Magnetic>
            </div>
          )}
        </div>

        {/* 4. Locked Overlay */}
        {project.isLocked && (
          <div className="absolute inset-0 z-40 bg-black/50 flex items-center justify-center flex-col gap-3 md:gap-4 rounded-[2.5rem] md:rounded-[3rem] text-center p-6 backdrop-blur-[1px]">
            <div style={{ transform: isTouchDevice ? "none" : "translateZ(60px)" }} className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
              <Hammer className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
            </div>
            <span style={{ transform: isTouchDevice ? "none" : "translateZ(40px)" }} className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest font-display">Developing</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};