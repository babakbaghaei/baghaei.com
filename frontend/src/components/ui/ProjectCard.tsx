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
  // Heavily blur/lock the project's screenshots in the detail modal.
  imagesLocked?: boolean;
  // Why the images are locked. 'nda' (default when unset) → confidential wording;
  // 'publishing' → softer "being published / coming soon" wording.
  imagesLockReason?: 'nda' | 'publishing';
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

// Resolve the project's signature mark: brand logo asset if present, else the
// project's category/tech icon. Used both for the small chip and the large
// faint background watermark.
const BrandIcon = ({ project, className }: { project: Project; className?: string }) => {
  const OverrideIcon = project.icon ? ICON_MAP[project.icon] : null;
  if (OverrideIcon) return <OverrideIcon className={className} />;
  return <TechIcon name={project.tech?.[0] || project.category} className={className} />;
};

const BrandMark = ({ project }: { project: Project }) => {
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
  return (
    <span className="text-white">
      <BrandIcon project={project} className="h-5 w-5" />
    </span>
  );
};

// The project colours are stored as rgba() (color ≈ 0.3α body, borderColor ≈
// 0.8α accent). For a FULLY-coloured card we need the solid hue, so pull the rgb
// triplet out and derive a darker shade for the deep bottom of the panel.
const rgbTriplet = (c: string) => {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return '110, 110, 120';
  const p = m[1].split(',').map((s) => parseFloat(s));
  return `${p[0]}, ${p[1]}, ${p[2]}`;
};
const shade = (triplet: string, f: number) =>
  triplet.split(',').map((s) => Math.round(parseFloat(s) * f)).join(', ');

const ProjectContent = ({ project }: { project: Project }) => {
  // The shared card tilt drives a glass reflection that sweeps across the panel
  // as the card pivots — the site's signature sheen, kept alive on the colour.
  const { tiltX, tiltY } = useCardTilt();
  const sheenAngle = useTransform([tiltX, tiltY], ([x, y]) => {
    const angleRad = Math.atan2(x as number, -(y as number));
    return (angleRad * 180) / Math.PI;
  });
  const sheen = useMotionTemplate`linear-gradient(${sheenAngle}deg, rgba(255,255,255,0.16) 0%, transparent 55%)`;

  // The project's assigned colour IS the card — FULLY coloured, no black base.
  // A bright lit corner (solid accent) melts into the deep brand body, darkening
  // toward the bottom-leading edge where the title sits so white copy stays crisp.
  const base = rgbTriplet(project.color);
  const bright = rgbTriplet(project.borderColor);
  const panelBg =
    `radial-gradient(135% 115% at 82% -12%, rgba(${bright}, 0.92) 0%, rgba(${bright}, 0) 56%),` +
    `linear-gradient(152deg, rgb(${base}) 0%, rgb(${shade(base, 0.5)}) 100%)`;

  return (
    <div className="relative h-full w-full rounded-[2rem]" style={{ transformStyle: "preserve-3d" }}>
      {/* Clipped, FLAT surface layer (colour + watermark + sheen + scrims). It
          owns the overflow-hidden so the texture stays inside the rounded card —
          kept on its OWN element, because overflow-hidden forces a flat stacking
          context and would otherwise collapse every translateZ on the content.
          At REST the card shows the SAME neutral glass surface as the tool cards
          (the Card's colorOnHoverOnly glass-fill below); the assigned project
          colour fades in on hover. Touch devices have no hover, so they stay
          full colour (md: gate). The text layer is a separate sibling, so this
          never dims the white copy. */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
        {/* Project colour — hidden at rest on desktop (neutral like the tool
            cards), fades in on hover; always on for touch (md: gate). */}
        <div className="absolute inset-0 opacity-100 transition-opacity duration-500 ease-out md:opacity-0 md:group-hover/card:opacity-100 motion-reduce:transition-none" style={{ background: panelBg }} />

        {/* Faint oversized brand watermark — gives the flat colour depth + texture. */}
        <div
          className="pointer-events-none absolute -bottom-6 -left-6 text-white/[0.06] transition-transform duration-700 ease-out group-hover/card:scale-110 group-hover/card:-rotate-6 motion-reduce:transition-none"
          aria-hidden
        >
          <BrandIcon project={project} className="h-44 w-44" />
        </div>

        {/* Tilt-reactive glass reflection (signature sheen) — gated to hover like
            the colour, so the neutral rest card shows NO gradient overlay. The
            sheen only belongs on the coloured hover state; on touch (no hover)
            the card is coloured, so it stays on there. */}
        <motion.div
          aria-hidden
          style={{ background: sheen, mixBlendMode: "overlay" }}
          className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-500 ease-out md:opacity-0 md:group-hover/card:opacity-100 motion-reduce:transition-none"
        />

        {/* No bottom scrim — Babak wants no shadow under the title/info. White
            copy stays legible on the deep brand body (and the neutral glass at
            rest) without it. */}
      </div>

      {/* Category chip (top, leading edge in RTL) — lifts further forward on hover. */}
      <div
        className="absolute right-4 top-4 z-10 transition-transform duration-300 ease-out group-hover/card:[transform:translateZ(60px)] motion-reduce:transition-none"
        style={{ transform: "translateZ(24px)" }}
      >
        <span className="rounded-full bg-black/35 md:bg-transparent md:group-hover/card:bg-black/35 transition-colors duration-500 ease-out motion-reduce:transition-none px-3 py-1 text-[11px] font-display font-bold text-white/90 ring-1 ring-white/15 backdrop-blur-md">
          {project.category}
        </span>
      </div>

      {/* Open affordance — appears + pops forward on hover. */}
      <div
        className="absolute left-4 top-4 z-10 opacity-0 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:[transform:translateZ(88px)] motion-reduce:transition-none"
        style={{ transform: "translateZ(24px)" }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-md">
          <ArrowUpLeft className="h-4 w-4" aria-hidden />
        </span>
      </div>

      {/* Lock / status badge (bottom-leading). NDA → lock icon; publishing →
          a soft "being published" pill so users know images aren't viewable yet. */}
      {project.imagesLockReason === 'publishing' ? (
        <div className="absolute left-4 bottom-4 z-10 transition-transform duration-300 ease-out group-hover/card:[transform:translateZ(55px)] motion-reduce:transition-none" style={{ transform: "translateZ(24px)" }}>
          <span className="rounded-full bg-black/40 md:bg-transparent md:group-hover/card:bg-black/40 transition-colors duration-500 ease-out motion-reduce:transition-none px-3 py-1 text-[11px] font-display font-bold text-white/90 ring-1 ring-white/15 backdrop-blur-md">
            در حال انتشار
          </span>
        </div>
      ) : project.isLocked && (
        <div className="absolute left-4 bottom-4 z-10 transition-transform duration-300 ease-out group-hover/card:[transform:translateZ(55px)] motion-reduce:transition-none" style={{ transform: "translateZ(24px)" }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 md:bg-transparent md:group-hover/card:bg-black/40 transition-colors duration-500 ease-out motion-reduce:transition-none text-white/80 ring-1 ring-white/15 backdrop-blur-md">
            <Lock className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      )}

      {/* Bottom content: brand + title always visible (float forward on hover);
          desc + tech reveal on hover (always open on touch where there is no hover). */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 p-5 text-right transition-transform duration-300 ease-out group-hover/card:[transform:translateZ(74px)] motion-reduce:transition-none md:p-6"
        dir="rtl"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-md">
            <BrandMark project={project} />
          </span>
          <h3 className="font-display text-lg font-black leading-tight text-white line-clamp-2 md:text-xl">
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
      glowColor={project.borderColor}
      roundedClass="rounded-[2rem]"
      className={isActive ? "ring-1 ring-white/15" : ""}
      isHoverable={true}
      colorOnHoverOnly
      contentClassName="p-0"
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
        className="group/card h-full w-full cursor-pointer rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-foreground/60"
        style={{ transformStyle: "preserve-3d" }}
      >
        <ProjectContent project={project} />
      </div>
    </Card>
  );
};
