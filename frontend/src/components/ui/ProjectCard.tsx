'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useTransform, useMotionTemplate } from 'framer-motion';
import { Globe, Layers, Smartphone, Gamepad2, Terminal, Workflow, Database, Box, Cpu, Shield, Palette, Braces, Dumbbell, ArrowUpLeft, Lock } from 'lucide-react';
import { Card, useCardTilt } from './Card';

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

// The small brand mark shown over the cover — sits inside a frosted chip so it
// stays legible on any photo. Falls back to the project's category icon.
const CoverLogo = ({ project }: { project: Project }) => {
  if (project.logo) {
    return (
      <Image
        src={project.logo}
        alt=""
        aria-hidden
        width={28}
        height={28}
        sizes="28px"
        className="h-6 w-6 object-contain"
      />
    );
  }
  const OverrideIcon = project.icon ? ICON_MAP[project.icon] : null;
  return (
    <span className="text-white">
      {OverrideIcon ? <OverrideIcon className="h-5 w-5" /> : <TechIcon name={project.tech?.[0] || project.category} className="h-5 w-5" />}
    </span>
  );
};

// Cinematic cover: the first screenshot fills the whole card (NDA shots are
// heavily blurred), or — when a project has no imagery — a branded gradient
// panel carrying a large faint brand mark so the card never reads as empty.
const ProjectCover = ({ project }: { project: Project }) => {
  const cover = project.images?.[0];
  const locked = project.imagesLocked;

  if (cover) {
    return (
      <Image
        src={cover}
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 768px) 90vw, 360px"
        className={`object-cover transition-[transform,filter] duration-700 ease-out will-change-transform group-hover/card:scale-[1.06] md:grayscale-[0.45] md:group-hover/card:grayscale-0 motion-reduce:transition-none ${locked ? 'scale-125 blur-2xl' : ''}`}
      />
    );
  }

  const OverrideIcon = project.icon ? ICON_MAP[project.icon] : null;
  return (
    <div className="absolute inset-0 bg-card">
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(125% 120% at 82% 0%, ${project.borderColor}, transparent 62%)` }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-white opacity-[0.10] transition-transform duration-700 group-hover/card:scale-110 motion-reduce:transition-none">
        {OverrideIcon ? <OverrideIcon className="h-32 w-32" /> : <TechIcon name={project.tech?.[0] || project.category} className="h-32 w-32" />}
      </div>
    </div>
  );
};

const ProjectContent = ({ project }: { project: Project }) => {
  // The shared card tilt drives a glass reflection that sweeps across the cover
  // as the card pivots — the site's signature sheen, kept alive on the photo.
  const { tiltX, tiltY } = useCardTilt();
  const sheenAngle = useTransform([tiltX, tiltY], ([x, y]) => {
    const angleRad = Math.atan2(x as number, -(y as number));
    return (angleRad * 180) / Math.PI;
  });
  const sheen = useMotionTemplate`linear-gradient(${sheenAngle}deg, rgba(255,255,255,0.20) 0%, transparent 55%)`;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]" style={{ transformStyle: "preserve-3d" }}>
      {/* Cover */}
      <div className="absolute inset-0">
        <ProjectCover project={project} />
      </div>

      {/* Legibility scrim — base gradient, deepened on hover so the revealed copy
          stays readable over bright screenshots. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 motion-reduce:transition-none" />

      {/* Tilt-reactive glass reflection over the cover (signature sheen). */}
      <motion.div
        aria-hidden
        style={{ background: sheen, mixBlendMode: "overlay" }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Category chip (top, leading edge in RTL). */}
      <div className="absolute right-4 top-4 z-10" style={{ transform: "translateZ(60px)" }}>
        <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-display font-bold text-white/90 ring-1 ring-white/15 backdrop-blur-md">
          {project.category}
        </span>
      </div>

      {/* Open affordance — appears on hover. */}
      <div className="absolute left-4 top-4 z-10 opacity-0 transition-all duration-300 group-hover/card:opacity-100 motion-reduce:transition-none" style={{ transform: "translateZ(60px)" }}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-md">
          <ArrowUpLeft className="h-4 w-4" aria-hidden />
        </span>
      </div>

      {/* NDA lock badge. */}
      {project.isLocked && (
        <div className="absolute left-4 bottom-4 z-10" style={{ transform: "translateZ(40px)" }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 ring-1 ring-white/15 backdrop-blur-md">
            <Lock className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      )}

      {/* Bottom content: brand + title always visible; desc + tech reveal on
          hover (always open on touch where there is no hover). */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-right md:p-6" dir="rtl" style={{ transform: "translateZ(50px)" }}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-md">
            <CoverLogo project={project} />
          </span>
          <h3 className="font-display text-lg font-black leading-tight text-white line-clamp-2 drop-shadow-lg md:text-xl">
            {project.title}
          </h3>
        </div>

        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-out group-hover/card:grid-rows-[1fr] group-hover/card:opacity-100 max-md:grid-rows-[1fr] max-md:opacity-100 motion-reduce:transition-none">
          <div className="min-h-0 overflow-hidden">
            <p className="mt-2.5 font-sans text-xs leading-relaxed text-white/75 line-clamp-2">
              {project.desc}
            </p>
            {project.tech && project.tech.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-end gap-1.5" dir="ltr">
                {project.tech.slice(0, 4).map((t, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/85 ring-1 ring-white/15 backdrop-blur-md">
                    <TechIcon name={t} />
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectCard: React.FC<{ project: Project, onClick: (e: React.MouseEvent<HTMLDivElement>) => void, isActive?: boolean }> = ({ project, onClick, isActive = false }) => {
  return (
    <Card
      glowColor={isActive ? project.borderColor : project.color}
      roundedClass="rounded-[2.2rem]"
      className={`p-2 ${isActive ? "ring-1 ring-white/10" : ""}`}
      isHoverable={true}
      colorOnHoverOnly={!isActive}
      contentClassName="p-1.5"
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
        className="group/card h-full w-full cursor-pointer rounded-[1.6rem] outline-none focus-visible:ring-2 focus-visible:ring-foreground/60"
        style={{ transformStyle: "preserve-3d" }}
      >
        <ProjectContent project={project} />
      </div>
    </Card>
  );
};
