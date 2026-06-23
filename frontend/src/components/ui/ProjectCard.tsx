'use client';

import React from 'react';
import Image from 'next/image';
import { Globe, Layers, Smartphone, Gamepad2, Terminal, Workflow, Database, Box, Cpu, Shield, Palette, Braces, Dumbbell } from 'lucide-react';
import { Card } from './Card';

export interface Metric {
 label: string;
 value: string;
}

export interface Project {
  id: number;
  slug?: string;
  title: string;
  category: string;
  role: string;
  desc: string;
  metrics: Metric[];
  color: string;
  borderColor: string;
  tech?: string[];
  href?: string;
  logo?: string;
  // Lucide icon name used as the corner mark when there is no brand-logo asset.
  icon?: string;
  images?: string[];
  // Heavily blur/lock the project's screenshots in the detail modal (NDA work).
  imagesLocked?: boolean;
  // Keep in data but hide from every public listing (re-enable later).
  hidden?: boolean;
  isLocked: boolean;
}

// Icon overrides for the corner mark fallback (when a project has no logo asset).
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Dumbbell, Gamepad2, Cpu, Shield, Smartphone, Palette,
};

const TechIcon = ({ name, className = "w-3 h-3" }: { name: string; className?: string }) => {
 const n = name.toLowerCase();
 if (n.includes('react') || n.includes('next')) return <Globe className={className} />;
 if (n.includes('webgl') || n.includes('three')) return <Layers className={className} />;
 if (n.includes('android') || n.includes('ios')) return <Smartphone className={className} />;
 if (n.includes('unity')) return <Gamepad2 className={className} />;
 if (n.includes('node') || n.includes('go') || n.includes('python')) return <Terminal className={className} />;
 if (n.includes('graphql') || n.includes('api')) return <Workflow className={className} />;
 if (n.includes('sql') || n.includes('redis')) return <Database className={className} />;
 if (n.includes('docker') || n.includes('k8s')) return <Box className={className} />;
 if (n.includes('ai') || n.includes('llm')) return <Cpu className={className} />;
 if (n.includes('security')) return <Shield className={className} />;
 if (n.includes('branding') || n.includes('ui')) return <Palette className={className} />;
 return <Braces className={className} />;
};

// Project brand logo rendered solid in the content flow — the same crisp treatment
// as the open detail modal (NOT a faint background watermark). Falls back to the
// project's category icon when no brand-logo asset exists.
const ProjectLogo = ({ project, size }: { project: Project; size: string }) => {
  const OverrideIcon = project.icon ? ICON_MAP[project.icon] : null;

  if (project.logo) {
    return (
      <Image
        src={project.logo}
        alt=""
        aria-hidden
        width={40}
        height={40}
        className={`${size} object-contain shrink-0 drop-shadow-lg`}
      />
    );
  }
  return (
    <div className="text-primary opacity-50 shrink-0 drop-shadow-lg">
      {OverrideIcon ? <OverrideIcon className={size} /> : <TechIcon name={project.tech?.[0] || project.category} className={size} />}
    </div>
  );
};

const ProjectContent = ({ project, horizontal }: { project: Project, horizontal: boolean }) => {
  if (horizontal) {
    return (
      <div className="flex items-center h-full w-full text-right px-8 py-4" dir="rtl" style={{ transformStyle: "preserve-3d" }}>
        <div
          className="ml-6 shrink-0"
          style={{ transform: "translateZ(40px)" }}
        >
          <ProjectLogo project={project} size="w-9 h-9" />
        </div>
        <div className="flex-1 min-w-0 space-y-0.5 overflow-visible" style={{ transformStyle: "preserve-3d" }}>
          <h3
            className="font-display text-foreground leading-tight font-bold text-lg md:text-xl truncate"
            style={{ transform: "translateZ(60px)" }}
          >
            {project.title}
          </h3>
          <div style={{ transform: "translateZ(30px)" }}>
            <p className="text-muted-foreground/70 font-sans text-xs md:text-sm leading-relaxed line-clamp-2">
              {project.desc}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full text-right" dir="rtl" style={{ transformStyle: "preserve-3d" }}>
      <div className="space-y-3 flex-1 min-h-0 overflow-visible" style={{ transformStyle: "preserve-3d" }}>
        <div className="flex items-center justify-start" style={{ transform: "translateZ(30px)" }}>
          <span className="text-xs font-normal uppercase font-display bg-white/5 px-3 py-1 rounded-full border border-white/5 text-muted-foreground">
            {project.role}
          </span>
        </div>
        <div className="flex items-center gap-3" style={{ transform: "translateZ(80px)" }}>
          <ProjectLogo project={project} size="w-9 h-9 md:w-10 md:h-10" />
          <h3 className="font-display text-foreground leading-tight font-black text-2xl md:text-3xl line-clamp-2">
            {project.title}
          </h3>
        </div>
        {/* translateZ lives on the WRAPPER, never on the clamped <p>: Safari drops
            -webkit-line-clamp when the clamped element itself carries a transform,
            which let the description spill over the tech tags. */}
        <div style={{ transform: "translateZ(40px)" }}>
          <p className="text-muted-foreground font-sans text-sm leading-relaxed line-clamp-3">
            {project.desc}
          </p>
        </div>
      </div>
      {project.tech && project.tech.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 md:gap-2 mt-4 justify-end"
          dir="ltr"
          style={{ transform: "translateZ(50px)" }}
        >
          {project.tech.slice(0, 4).map((t, i) => (
            <span key={i} className="rounded-full bg-white/5 border border-white/5 font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 pe-1.5 ps-2.5 py-1 text-xs">
              <TechIcon name={t} />
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectCard: React.FC<{ project: Project, onClick: (e: React.MouseEvent<HTMLDivElement>) => void, horizontal?: boolean, isActive?: boolean }> = ({ project, onClick, horizontal = false, isActive = false }) => {
  return (
    <Card
      glowColor={isActive ? project.borderColor : project.color}
      roundedClass="rounded-[3rem]"
      className={`${horizontal ? "p-0" : "p-2 md:p-3"} ${isActive ? "ring-1 ring-white/10" : ""}`}
      isHoverable={true}
      colorOnHoverOnly={!isActive}
      contentClassName={horizontal ? "p-0" : "p-6 md:p-7"}
    >
      <div
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${project.title} — نمایش جزئیات پروژه`}
        className="h-full w-full cursor-pointer overflow-visible rounded-[3rem] outline-none focus-visible:ring-2 focus-visible:ring-foreground/60"
        style={{ transformStyle: "preserve-3d" }}
      >
        <ProjectContent project={project} horizontal={horizontal} />
      </div>
    </Card>
  );
};
