'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { 
 Hammer, 
 Database, 
 Cpu, 
 Layers, 
 Shield, 
 Smartphone,
 Terminal,
 Box,
 Braces,
 Gamepad2,
 Globe,
 Palette,
 Radio,
 Workflow
} from 'lucide-react';

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
  href?: string;
}

interface ProjectCardProps {
 project: Project;
 onClick: () => void;
 compact?: boolean;
 isActive?: boolean;
 index?: number;
 scrollProgress?: any;
}

const TechIcon = ({ name }: { name: string }) => {
 const n = name.toLowerCase();
 if (n.includes('react') || n.includes('next') || n.includes('vue') || n.includes('html') || n.includes('css')) return <Globe className="w-3 h-3" />;
 if (n.includes('webgl') || n.includes('three')) return <Layers className="w-3 h-3" />;
 if (n.includes('android') || n.includes('ios') || n.includes('mobile') || n.includes('flutter')) return <Smartphone className="w-3 h-3" />;
 if (n.includes('unity') || n.includes('c#') || n.includes('game') || n.includes('fmod')) return <Gamepad2 className="w-3 h-3" />;
 if (n.includes('node') || n.includes('go') || n.includes('python') || n.includes('fastapi') || n.includes('c++')) return <Terminal className="w-3 h-3" />;
 if (n.includes('graphql') || n.includes('api') || n.includes('websockets')) return <Workflow className="w-3 h-3" />;
 if (n.includes('sql') || n.includes('mongo') || n.includes('redis') || n.includes('prisma') || n.includes('elastic')) return <Database className="w-3 h-3" />;
 if (n.includes('docker') || n.includes('k8s') || n.includes('kubern') || n.includes('linux')) return <Box className="w-3 h-3" />;
 if (n.includes('aws') || n.includes('cloud')) return <Layers className="w-3 h-3" />;
 if (n.includes('kafka') || n.includes('message')) return <Radio className="w-3 h-3" />;
 if (n.includes('ai') || n.includes('llm') || n.includes('torch') || n.includes('gpt')) return <Cpu className="w-3 h-3" />;
 if (n.includes('security') || n.includes('امنیت')) return <Shield className="w-3 h-3" />;
 if (n.includes('branding') || n.includes('ui') || n.includes('design') || n.includes('figma')) return <Palette className="w-3 h-3" />;
 return <Braces className="w-3 h-3" />;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, compact = false, isActive = false, index = 0, scrollProgress }) => {
 const cardRef = useRef<HTMLDivElement>(null);
 const [isTouchDevice, setIsTouchDevice] = useState(false);
 const [isHovered, setIsHovered] = useState(false);
 const [isTransitioning, setIsTransitioning] = useState(false);
 
 const fallbackProgress = useMotionValue(0.5);
 const activeProgress = scrollProgress || fallbackProgress;

 // PARALLAX LOGIC: Staggered movement - Right-to-Left Descending (RTL Stairs)
 // Index 0 (Right) has 0 base offset, Index 1 has 30px, Index 2 has 60px...
 const colIndex = index % 3;
 const parallaxY = useTransform(
  activeProgress, 
  [0, 1], 
  [colIndex * 20 + 30, colIndex * 20 - 30]
 );

 const mouseX = useMotionValue(-1000);
 const mouseY = useMotionValue(-1000);

 // High-end physics: Balanced between Snappy and Smooth
 const springConfig = { stiffness: 300, damping: 40 };
 const tiltX = useSpring(0, springConfig);
 const tiltY = useSpring(0, springConfig);
 const scale = useSpring(1, springConfig);
 
 // Lighting opacities
 const sheenOpacity = useSpring(0, { stiffness: 200, damping: 35 });
 const borderOpacity = useSpring(0.25, { stiffness: 200, damping: 35 });

 // 3D Rotations (15 degrees depth like Services cards)
 const rotateX = useTransform(tiltY, [-0.5, 0.5], [15, -15]);
 const rotateY = useTransform(tiltX, [-0.5, 0.5], [-15, 15]);

 // 1. BORDER LIGHTING (Spotlight follows mouse globally)
 // This uses the project's color but makes it brighter at the mouse point
 const borderBackground = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.8), ${project.borderColor} 40%, transparent 100%)`;

 // 2. INNER REFLECTION (Angular Sheen)
 const sheenAngle = useTransform([tiltX, tiltY], ([x, y]) => {
  const angleRad = Math.atan2(x as number, -(y as number));
  return (angleRad * 180) / Math.PI;
 });
 const contrastFactor = useTransform([tiltX, tiltY], ([x, y]) => {
  const d = Math.sqrt(Math.pow(x as number, 2) + Math.pow(y as number, 2));
  return Math.min(d * 2.5, 1);
 });
 // Brighter version of the project's own color for the sheen highlight (No gray)
 const colorHighlight = useTransform(contrastFactor, [0, 1], [project.color, project.borderColor]);
 const innerBackground = useMotionTemplate`linear-gradient(
  ${sheenAngle}deg, 
  ${project.color} 0%, 
  ${project.color} 50%,
  ${colorHighlight} 100%
 )`;

 useEffect(() => {
  setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
 }, []);

 // Reset logic when modal closes - instant re-enable
 useEffect(() => {
  if (!isActive && isTransitioning) {
    setIsTransitioning(false);
  }
 }, [isActive, isTransitioning]);

 useEffect(() => {
  if (isTouchDevice) return;

  const handleGlobalMouseMove = (e: MouseEvent) => {
   if (!cardRef.current || isTransitioning) return;
   const rect = cardRef.current.getBoundingClientRect();
   
   const x = e.clientX - rect.left;
   const y = e.clientY - rect.top;
   
   const isOver = e.clientX >= rect.left && e.clientX <= rect.right && 
                  e.clientY >= rect.top && e.clientY <= rect.bottom;

   // Proximity detection for border light (active within 600px of card center)
   const centerX = rect.left + rect.width / 2;
   const centerY = rect.top + rect.height / 2;
   const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
   
   mouseX.set(x);
   mouseY.set(y);
   setIsHovered(isOver);
   
   if (!project.isLocked) {
    // Requirements: Border lights up even before reaching the card
    // 0.25 base, up to 0.8 when close/hovered
    borderOpacity.set(dist < 600 ? (isOver ? 0.8 : 0.45) : 0.25);
    
    if (isOver) {
     tiltX.set(x / rect.width - 0.5);
     tiltY.set(y / rect.height - 0.5);
     scale.set(1.02);
     sheenOpacity.set(0.8);
    } else {
     tiltX.set(0);
     tiltY.set(0);
     scale.set(1);
     sheenOpacity.set(0);
    }
   }
  };

  window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
  return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
 }, [project.isLocked, isTouchDevice, isTransitioning, tiltX, tiltY, scale, sheenOpacity, borderOpacity, mouseX, mouseY]);

 const handleCardClick = () => {
  if (project.isLocked || isTransitioning) return;
  setIsTransitioning(true);
  setIsHovered(false);
  
  // Instant neutralize for clean layout expansion - Zero Lag
  tiltX.jump(0);
  tiltY.jump(0);
  scale.jump(1);
  sheenOpacity.jump(0);
  borderOpacity.jump(0.25);
  
  onClick();
 };

 return (
  <div 
   className={`shrink-0 w-full h-full relative select-none ${compact ? 'p-1' : 'p-2 md:p-4'}`}
   style={{ perspective: "2000px" }}
  >
   <motion.div
    ref={cardRef}
    layoutId={`project-${project.id}`}
    onClick={handleCardClick}
    className={`project-card group relative flex flex-col h-full w-full z-10 bg-card rounded-[2.2rem] md:rounded-[3rem] ${project.isLocked ? 'cursor-default' : 'cursor-pointer'} shadow-2xl`}
    style={{ 
     rotateX: isTransitioning ? 0 : rotateX, 
     rotateY: isTransitioning ? 0 : rotateY, 
     y: parallaxY,
     scale,
     transformStyle: "preserve-3d",
     transition: "none"
    }}
    transition={{ type: 'spring', stiffness: 200, damping: 30, mass: 0.8 }}
   >
    {/* 1. Background Layers (Lighting System) */}
    <div className="absolute inset-0 rounded-[2.2rem] md:rounded-[3rem] overflow-hidden z-0 pointer-events-none">
     {/* Sheen reflection (Project Color Based) */}
     <motion.div 
      style={{
       opacity: sheenOpacity,
       background: innerBackground,
       mixBlendMode: 'overlay',
      }}
      className="absolute inset-0 w-full h-full z-0" 
     />
     
     {/* Border Spotlight (Follows mouse globally) */}
     <motion.div 
      className="absolute inset-0 pointer-events-none rounded-[2.2rem] md:rounded-[3rem] z-20"
      style={{
       opacity: borderOpacity,
       padding: '1px',
       background: borderBackground,
       WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
       WebkitMaskComposite: 'xor', 
       maskComposite: 'exclude',
      }}
     />
    </div>

    {/* 2. Floating Content (3D Depth Elements) */}
    <div 
     className={`flex-1 flex flex-col h-full relative z-10 pointer-events-none text-right ${compact ? 'p-6 justify-center' : 'p-8 md:p-10'}`} 
     style={{
      transformStyle: "preserve-3d",
      opacity: project.isLocked ? 0.4 : 1,
      filter: project.isLocked ? 'blur(5px)' : 'none'
     }}
    >
     <div style={{ transform: isHovered && !isTransitioning ? "translateZ(60px)" : "translateZ(0px)", transition: "transform 0.4s ease-out" }} className="space-y-3">
      {!compact && (
        <div className="flex items-center justify-start">
         <span className="text-[10px] font-normal uppercase font-display bg-white/5 px-3 py-1 rounded-full border border-white/5 text-muted-foreground">
          {project.category}
         </span>
        </div>
      )}
      
      <h3 className={`font-display text-foreground leading-tight font-black ${compact ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'}`}>
       {project.title}
      </h3>

      {compact && (
        <p className="text-muted-foreground font-sans text-[11px] leading-relaxed line-clamp-3">
          {project.desc}
        </p>
      )}

      {!compact && (
       <div className="mt-2 inline-flex items-center gap-2 text-muted-foreground text-[10px] md:text-xs font-bold font-display">
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
        <span>{project.role}</span>
       </div>
      )}
     </div>
  
     {!compact && (
      <div style={{ transform: isHovered && !isTransitioning ? "translateZ(25px)" : "translateZ(0px)", transition: "transform 0.4s ease-out" }} className="mt-4">
       <p className="text-muted-foreground font-sans leading-relaxed text-sm md:text-base line-clamp-4">{project.desc}</p>
      </div>
     )}
  
     {project.tech && project.tech.length > 0 && (
      <div style={{ transform: isHovered && !isTransitioning ? "translateZ(15px)" : "translateZ(0px)", transition: "transform 0.4s ease-out" }} className={`flex flex-wrap gap-1.5 md:gap-2 mt-auto justify-start`} dir="ltr">
       {project.tech.slice(0, 4).map((t, i) => (
        <span key={i} className={`rounded-full bg-secondary border border-border font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 ${compact ? 'p-1.5' : 'pl-1.5 pr-2.5 py-1 text-[9px]'}`}>
         <TechIcon name={t} />
         {!compact && t}
        </span>
       ))}
      </div>
     )}
    </div>

    {/* 3. Locked Overlay */}
    {project.isLocked && (
     <div className="absolute inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center flex-col gap-3 rounded-[2.2rem] md:rounded-[3rem] p-6 text-center border border-white/5 shadow-2xl">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary border border-border rounded-full flex items-center justify-center">
       <Hammer className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
      </div>
      <span className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest font-display">Coming Soon</span>
     </div>
    )}
   </motion.div>
  </div>
 );
};
