'use client';

import React from 'react';
import { Globe, Layers, Smartphone, Gamepad2, Terminal, Workflow, Database, Box, Cpu, Shield, Palette, Radio, Braces } from 'lucide-react';
import { Card } from './Card';

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
  tech?: string[];
  href?: string;
  isLocked: boolean;
}

const TechIcon = ({ name }: { name: string }) => {
 const n = name.toLowerCase();
 if (n.includes('react') || n.includes('next')) return <Globe className="w-3 h-3" />;
 if (n.includes('webgl') || n.includes('three')) return <Layers className="w-3 h-3" />;
 if (n.includes('android') || n.includes('ios')) return <Smartphone className="w-3 h-3" />;
 if (n.includes('unity')) return <Gamepad2 className="w-3 h-3" />;
 if (n.includes('node') || n.includes('go') || n.includes('python')) return <Terminal className="w-3 h-3" />;
 if (n.includes('graphql') || n.includes('api')) return <Workflow className="w-3 h-3" />;
 if (n.includes('sql') || n.includes('redis')) return <Database className="w-3 h-3" />;
 if (n.includes('docker') || n.includes('k8s')) return <Box className="w-3 h-3" />;
 if (n.includes('ai') || n.includes('llm')) return <Cpu className="w-3 h-3" />;
 if (n.includes('security')) return <Shield className="w-3 h-3" />;
 if (n.includes('branding') || n.includes('ui')) return <Palette className="w-3 h-3" />;
 return <Braces className="w-3 h-3" />;
};

const ProjectContent = ({ project, horizontal }: { project: Project, horizontal: boolean }) => {
  if (horizontal) {
    return (
      <div className="flex items-center h-full w-full text-right px-8 py-4" dir="rtl" style={{ transformStyle: "preserve-3d" }}>
        <div 
          className="ml-6 text-primary/80 shrink-0" 
          style={{ transform: "translateZ(40px)" }}
        >
          <TechIcon name={project.tech?.[0] || 'code'} />
        </div>
        <div className="flex-1 space-y-0.5 overflow-visible" style={{ transformStyle: "preserve-3d" }}>
          <h3 
            className="font-display text-foreground leading-tight font-bold text-lg md:text-xl truncate" 
            style={{ transform: "translateZ(60px)" }}
          >
            {project.title}
          </h3>
          <p 
            className="text-muted-foreground/40 font-sans text-xs md:text-sm leading-relaxed line-clamp-1" 
            style={{ transform: "translateZ(30px)" }}
          >
            {project.desc}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full text-right" dir="rtl" style={{ transformStyle: "preserve-3d" }}>
      <div className="space-y-3 flex-1 overflow-visible" style={{ transformStyle: "preserve-3d" }}>
        <div className="flex items-center justify-start" style={{ transform: "translateZ(30px)" }}>
          <span className="text-[10px] font-normal uppercase font-display bg-white/5 px-3 py-1 rounded-full border border-white/5 text-muted-foreground">
            {project.role}
          </span>
        </div>
        <h3 
          className="font-display text-foreground leading-tight font-black text-2xl md:text-3xl" 
          style={{ transform: "translateZ(80px)" }}
        >
          {project.title}
        </h3>
        <p 
          className="text-muted-foreground font-sans text-sm leading-relaxed line-clamp-4" 
          style={{ transform: "translateZ(40px)" }}
        >
          {project.desc}
        </p>
      </div>
      {project.tech && project.tech.length > 0 && (
        <div 
          className="flex flex-wrap gap-1.5 md:gap-2 mt-6 justify-start" 
          dir="ltr" 
          style={{ transform: "translateZ(50px)" }}
        >
          {project.tech.slice(0, 4).map((t, i) => (
            <span key={i} className="rounded-full bg-white/5 border border-white/5 font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 text-[9px]">
              <TechIcon name={t} />
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectCard: React.FC<{ project: Project, onClick: () => void, horizontal?: boolean }> = ({ project, onClick, horizontal = false }) => {
  return (
    <Card 
      glowColor={project.color}
      roundedClass="rounded-[3rem]"
      className={horizontal ? "p-0" : "p-2 md:p-4"}
      isHoverable={true}
    >
      <div onClick={onClick} className="h-full w-full cursor-pointer overflow-visible" style={{ transformStyle: "preserve-3d" }}>
        <ProjectContent project={project} horizontal={horizontal} />
      </div>
    </Card>
  );
};