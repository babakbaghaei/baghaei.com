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
  Braces,
  Gamepad2,
  Globe,
  Palette,
  Cloud,
  Radio,
  Workflow
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
  compact?: boolean;
}

const TechIcon = ({ name }: { name: string }) => {
  const n = name.toLowerCase();
  // Frontend / Web
  if (n.includes('react') || n.includes('next') || n.includes('vue') || n.includes('html') || n.includes('css')) return <Globe className="w-3 h-3" />;
  if (n.includes('webgl') || n.includes('three')) return <Layers className="w-3 h-3" />;
  
  // Mobile
  if (n.includes('android') || n.includes('ios') || n.includes('mobile') || n.includes('flutter')) return <Smartphone className="w-3 h-3" />;
  
  // Game
  if (n.includes('unity') || n.includes('c#') || n.includes('game') || n.includes('fmod')) return <Gamepad2 className="w-3 h-3" />;
  
  // Backend / Langs
  if (n.includes('node') || n.includes('go') || n.includes('python') || n.includes('fastapi') || n.includes('c++')) return <Terminal className="w-3 h-3" />;
  if (n.includes('graphql') || n.includes('api') || n.includes('websockets')) return <Workflow className="w-3 h-3" />;
  
  // Data
  if (n.includes('sql') || n.includes('mongo') || n.includes('redis') || n.includes('prisma') || n.includes('elastic')) return <Database className="w-3 h-3" />;
  
  // DevOps / Infra
  if (n.includes('docker') || n.includes('k8s') || n.includes('kubern') || n.includes('linux')) return <Box className="w-3 h-3" />;
  if (n.includes('aws') || n.includes('cloud')) return <Cloud className="w-3 h-3" />;
  if (n.includes('kafka') || n.includes('message')) return <Radio className="w-3 h-3" />;
  
  // AI
  if (n.includes('ai') || n.includes('llm') || n.includes('torch') || n.includes('gpt')) return <Cpu className="w-3 h-3" />;
  
  // Security
  if (n.includes('security') || n.includes('امنیت')) return <Shield className="w-3 h-3" />;
  
  // Design
  if (n.includes('branding') || n.includes('ui') || n.includes('design') || n.includes('figma')) return <Palette className="w-3 h-3" />;
  
  return <Braces className="w-3 h-3" />;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, compact = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isInView = useInView(containerRef, { margin: "200px" });
  
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { stiffness: 300, damping: 40 };
  const tiltX = useSpring(0, springConfig);
  const tiltY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  
  const innerGlowOpacity = useSpring(0, { stiffness: 200, damping: 35 });
  const borderOpacity = useSpring(0.4, { stiffness: 200, damping: 35 });

  const rotateX = useTransform(tiltY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-12, 12]);

  const borderBackground = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, white 0%, ${project.borderColor} 40%, transparent 100%)`;

  const sheenAngle = useTransform([tiltX, tiltY], ([x, y]) => {
    const angleRad = Math.atan2(x as number, -(y as number));
    return (angleRad * 180) / Math.PI;
  });

  const gradientStop = useTransform([tiltX, tiltY], ([x, y]) => {
    const d = Math.sqrt(Math.pow(x as number, 2) + Math.pow(y as number, 2));
    return 60 - (d * 50); 
  });
  
  const contrastFactor = useTransform([tiltX, tiltY], ([x, y]) => {
    const d = Math.sqrt(Math.pow(x as number, 2) + Math.pow(y as number, 2));
    return Math.min(d * 2, 1);
  });

  const colorA = project.color;
  // Interpolate to brightest project color at edges
  const colorB = useTransform(contrastFactor, [0, 1], [project.color, project.borderColor]);
  
  const innerBackground = useMotionTemplate`linear-gradient(
      ${sheenAngle}deg, 
      ${colorA} 0%, 
      ${colorA} ${gradientStop}%,
      ${colorB} 100%
    )`;
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const scrollParent = containerRef.current?.closest('.flex.overflow-x-auto');
    const mousePos = { x: -1000, y: -1000 };

    const updateSpotlight = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      
      const x = mousePos.x - rect.left;
      const y = mousePos.y - rect.top;
      
      const isMouseOver = mousePos.x >= rect.left && 
                         mousePos.x <= rect.right && 
                         mousePos.y >= rect.top && 
                         mousePos.y <= rect.bottom;

      setIsHovered(isMouseOver);
      mouseX.set(x);
      mouseY.set(y);

      if (!project.isLocked) {
        innerGlowOpacity.set(isMouseOver ? 0.8 : 0);
        
        // Always show some border glow when mouse is "active" in the area
        borderOpacity.set(isMouseOver ? 1 : 0.4); 
        scale.set(isMouseOver ? 1.02 : 1);

        if (isMouseOver) {
          tiltX.set(x / rect.width - 0.5);
          tiltY.set(y / rect.height - 0.5);
        } else {
          tiltX.set(0);
          tiltY.set(0);
        }
      } else {
        // Ensure no interaction for locked projects
        innerGlowOpacity.set(0);
        borderOpacity.set(0);
        scale.set(1);
        tiltX.set(0);
        tiltY.set(0);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      updateSpotlight();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [project.isLocked, isTouchDevice]);

  return (
    <div 
      ref={containerRef}
      className={`shrink-0 w-full h-full relative select-none ${compact ? 'p-1 md:p-2' : 'p-2 md:p-4'}`}
      style={{ perspective: "2000px" }}
    >
      <motion.div
        ref={cardRef}
        layoutId={`project-${project.id}`}
        onClick={project.isLocked ? undefined : onClick}
        style={{ 
          rotateX, 
          rotateY, 
          scale, 
          transformStyle: "preserve-3d",
          willChange: isHovered ? "transform" : "auto"
        }}
        className={`project-card group relative flex flex-col h-full w-full z-10 bg-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] ${project.isLocked ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {/* 1. Clipping Background Layer */}
        <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden z-0 bg-[#0a0a0a]">
          {/* Static Tint Layer */}
          <div 
             className="absolute inset-0 w-full h-full" 
             style={{ backgroundColor: project.isLocked ? 'transparent' : project.color, opacity: 0.05 }}
          />
          
          {!isTouchDevice && (
            <motion.div 
              style={{
                opacity: innerGlowOpacity,
                background: innerBackground,
                mixBlendMode: 'screen',
              }}
              className="absolute inset-0 w-full h-full pointer-events-none z-0" 
            />
          )}
          
          {/* Border Glow */}
          {!isTouchDevice && (
            <motion.div 
              className="absolute inset-0 pointer-events-none rounded-[2rem] md:rounded-[2.5rem] z-20"
              style={{
                opacity: borderOpacity,
                padding: '1px',
                background: borderBackground,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                WebkitMaskComposite: 'xor', 
                maskComposite: 'exclude',
              }}
            />
          )}
        </div>

        {/* 2. Full Content Layer */}
                <div className={`flex-1 flex flex-col h-full relative z-10 pointer-events-none text-right ${compact ? 'p-5 md:p-6 justify-center' : 'p-6 md:p-8'}`} style={{
                  transformStyle: "preserve-3d",
                  opacity: project.isLocked ? 0.4 : 1,
                  filter: project.isLocked ? 'blur(5px)' : 'none'
                }}>
                  <div style={{ transform: isTouchDevice ? "none" : "translateZ(100px)" }} className={`space-y-3 ${compact ? 'md:space-y-1' : 'md:space-y-4'}`}>
                    <div className="flex items-center justify-start gap-2">
                      <span className="text-[9px] md:text-[10px] font-bold text-white/60 uppercase font-display tracking-normal bg-white/5 px-2 py-1 rounded-full">{project.category}</span>
                    </div>
                    <h3 className={`font-display text-white leading-tight font-black ${compact ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'}`}>
                      {project.title}
                    </h3>
                    {!compact && (
                      <div className="mt-2 inline-flex items-center gap-2 text-white/50 text-[10px] md:text-xs font-bold font-display tracking-normal">
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                        <span>{project.role}</span>
                      </div>
                    )}
                  </div>
        
                  {!compact && (
                    <div style={{ transform: isTouchDevice ? "none" : "translateZ(60px)" }} className="mt-4">
                      <p className="text-white/60 font-sans leading-relaxed text-sm line-clamp-4">{project.desc}</p>
                    </div>
                  )}
        
                  {project.tech && (
                    <div style={{ transform: isTouchDevice ? "none" : "translateZ(50px)" }} className={`flex flex-wrap gap-1.5 md:gap-2 mt-auto justify-start`} dir="ltr">
                      {project.tech.slice(0, compact ? 4 : 4).map((t, i) => (
                        <span key={i} className={`rounded-full bg-white/5 border border-white/10 font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5 hover:bg-white/10 transition-colors ${compact ? 'p-1.5' : 'pl-1.5 pr-2.5 py-1 text-[9px]'}`}>
                          <TechIcon name={t} />
                          {!compact && t}
                        </span>
                      ))}
                      {project.tech.length > (compact ? 4 : 4) && (
                        <span className={`px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-wider`}>
                          +{project.tech.length - (compact ? 4 : 4)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
        {/* 4. Locked Overlay */}
        {project.isLocked && (
          <div className="absolute inset-0 z-40 bg-black/50 flex items-center justify-center flex-col gap-3 md:gap-4 rounded-[2rem] md:rounded-[2.5rem] text-center p-6">
            <div style={{ transform: isTouchDevice ? "none" : "translateZ(60px)" }} className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
              <Hammer className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
            </div>
            <span style={{ transform: isTouchDevice ? "none" : "translateZ(40px)" }} className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest font-display">در حال توسعه</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
