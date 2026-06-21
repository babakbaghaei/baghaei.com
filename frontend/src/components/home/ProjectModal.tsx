'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion';
import {
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
 Braces,
 Image as ImageIcon
} from 'lucide-react';
import Logo from '../layout/Logo';
import { Project } from '../ui/ProjectCard';
import { formatMetric } from '@/lib/utils/format';

interface ProjectModalProps {
 project: Project | null;
 isOpen: boolean;
 onClose: () => void;
 originRect?: DOMRect | null;
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

// Small structural eyebrow: an accent tick + a Persian label. No letter-spacing
// or monospace here — those break Persian's connected script.
const SectionLabel = ({ children, accent }: { children: React.ReactNode; accent: string }) => (
 <div className="flex items-center gap-2.5">
  <span className="w-5 h-px shrink-0" style={{ background: accent }} />
  <span className="text-xs font-bold text-muted-foreground font-display">{children}</span>
 </div>
);

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ProjectModal({ project, isOpen, onClose, originRect }: ProjectModalProps) {
 const stageRef = useRef<HTMLDivElement>(null);
 const dialogRef = useRef<HTMLDivElement>(null);
 const restoreFocusRef = useRef<HTMLElement | null>(null);
 const wasOpen = useRef(false);
 const reduceMotion = useReducedMotion();

 // Single-element "zoom from card": the content card itself scales up from the
 // clicked card's position. Uniform scale (one value) means it can NEVER squish —
 // it reads as a clean zoom, and there is no empty ghost box or duplicate frame.
 const cardScale = useMotionValue(1);
 const cardOpacity = useMotionValue(0);
 const bgOpacity = useMotionValue(0);
 const [origin, setOrigin] = useState('50% 50%');

 // `mounted` keeps the dialog in the DOM through the close animation.
 const [mounted, setMounted] = useState(false);

 // Remember the last opened project so its content stays rendered through the
 // close animation. Adjusting state during render (the supported React pattern)
 // avoids reading/writing a ref mid-render.
 const [lastProject, setLastProject] = useState<Project | null>(null);

 // Map the clicked card into the stage: the transform-origin (so the modal grows
 // out of the card) and the start scale (card width / modal width, uniform).
 const computeZoom = (stage: HTMLElement) => {
  const sr = stage.getBoundingClientRect();
  if (originRect && originRect.width > 0 && originRect.height > 0 && sr.width > 0) {
   const cx = originRect.left + originRect.width / 2 - sr.left;
   const cy = originRect.top + originRect.height / 2 - sr.top;
   // Clamp the pivot inside the modal so it always grows in place (toward the
   // card's side) rather than swinging in from an off-screen point.
   const ox = Math.min(Math.max((cx / sr.width) * 100, 0), 100);
   const oy = Math.min(Math.max((cy / sr.height) * 100, 0), 100);
   const originStr = `${ox}% ${oy}%`;
   const scale = Math.min(Math.max(originRect.width / sr.width, 0.35), 0.9);
   return { originStr, scale };
  }
  return { originStr: '50% 50%', scale: 0.92 };
 };

 useLayoutEffect(() => {
  const stage = stageRef.current;

  // OPEN — the card zooms up from the clicked card's position, content fades in.
  if (isOpen && mounted && !wasOpen.current && stage) {
   wasOpen.current = true;
   const { originStr, scale } = computeZoom(stage);
   setOrigin(originStr);
   cardScale.set(scale);
   cardOpacity.set(0);
   bgOpacity.set(0);

   if (reduceMotion) {
    cardScale.set(1);
    animate(bgOpacity, 1, { duration: 0.2 });
    animate(cardOpacity, 1, { duration: 0.2 });
    return;
   }

   const spring = { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.9 };
   animate(cardScale, 1, spring);
   animate(bgOpacity, 1, { duration: 0.3 });
   animate(cardOpacity, 1, { duration: 0.22 });
  }

  // CLOSE — the card zooms back down into the card, then unmounts.
  if (!isOpen && wasOpen.current) {
   wasOpen.current = false;
   if (!stage) {
    setMounted(false);
    return;
   }
   const { originStr, scale } = computeZoom(stage);
   setOrigin(originStr);

   if (reduceMotion) {
    const a = [
     animate(cardOpacity, 0, { duration: 0.15 }),
     animate(bgOpacity, 0, { duration: 0.2 }),
    ];
    Promise.all(a.map((x) => x.finished)).then(() => setMounted(false)).catch(() => {});
    return;
   }

   const spring = { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.85 };
   const a = [
    animate(cardScale, scale, spring),
    animate(cardOpacity, 0, { duration: 0.22, delay: 0.05 }),
    animate(bgOpacity, 0, { duration: 0.3 }),
   ];
   Promise.all(a.map((x) => x.finished)).then(() => setMounted(false)).catch(() => {});
  }
 }, [isOpen, mounted]); // eslint-disable-line react-hooks/exhaustive-deps

 // Scroll lock
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

 // Accessibility: Escape to close, focus trap, and focus restoration.
 useEffect(() => {
  if (!mounted) return;
  restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;
  const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 0);

  const onKeyDown = (e: KeyboardEvent) => {
   if (e.key === 'Escape') {
    e.preventDefault();
    onClose();
    return;
   }
   if (e.key !== 'Tab') return;
   const root = dialogRef.current;
   if (!root) return;
   const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === root
   );
   if (items.length === 0) {
    e.preventDefault();
    root.focus();
    return;
   }
   const first = items[0];
   const last = items[items.length - 1];
   if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
   } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
   }
  };

  document.addEventListener('keydown', onKeyDown);
  return () => {
   document.removeEventListener('keydown', onKeyDown);
   window.clearTimeout(focusTimer);
   restoreFocusRef.current?.focus?.();
  };
 }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

 // Keep the last project through the close animation so content stays rendered.
 if (project && project !== lastProject) setLastProject(project);
 const display = project ?? lastProject;
 // Mount synchronously on open so the layout effect can measure before paint.
 if (isOpen && !mounted) setMounted(true);
 if (!mounted || !display) return null;

 const accent = display.borderColor;
 const accentSoft = display.color;
 const hasMetrics = display.metrics && display.metrics.length > 0;
 const hasImages = !!(display.images && display.images.length > 0);
 const projectId = `PRJ-${String(display.id).padStart(3, '0')}`;
 const titleId = `project-modal-title-${display.id}`;

 const spec = [
  { label: 'نقش اجرایی', value: display.role },
  { label: 'حوزه فعالیت', value: display.category },
 ];

 const frameClass =
  'absolute rounded-none md:rounded-[2.5rem] border-x border-border md:border shadow-2xl bg-card overflow-hidden';

 if (typeof document === 'undefined') return null;

 // Portal to <body> so `position: fixed` resolves against the viewport — the
 // Projects section's 3D-transformed ancestors would otherwise become the
 // containing block and break full-screen coverage / centering.
 return createPortal(
  <div
   className="fixed inset-0 z-[100000] flex items-center justify-center p-0 md:p-8"
   data-lenis-prevent
  >
   {/* Backdrop */}
   <motion.div
    onClick={onClose}
    style={{ opacity: bgOpacity }}
    className="absolute inset-0 bg-background/90 backdrop-blur-xl cursor-pointer"
   />

   {/* Stage — fixes the final modal size; the card zooms within it */}
   <div
    ref={stageRef}
    className="relative w-full max-w-5xl h-full md:h-[80vh] md:max-h-[760px] z-10"
   >
    {/* Content card — zooms up from the clicked card (uniform scale, no squish) */}
    <motion.div
     ref={dialogRef}
     role="dialog"
     aria-modal="true"
     aria-labelledby={titleId}
     tabIndex={-1}
     className={`${frameClass} inset-0 flex flex-col outline-none`}
     style={{
      opacity: cardOpacity,
      scale: cardScale,
      transformOrigin: origin,
      willChange: 'transform, opacity',
      pointerEvents: isOpen ? 'auto' : 'none',
     }}
    >
     {/* Per-project accent ambience */}
     <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{ background: `radial-gradient(110% 70% at 100% 0%, ${accentSoft}, transparent 55%)` }}
     />

     {/* Scrollable Content */}
     <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar relative z-10" dir="rtl">
      {/* Sticky top bar — fully covers content scrolling beneath */}
      <div className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 lg:px-16 py-4 bg-card/80 backdrop-blur-xl border-b border-border">
       <button
        onClick={onClose}
        aria-label="بستن"
        className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
       >
        <X className="w-5 h-5" />
       </button>
       {/* Latin id — the one place mono + tracking is correct */}
       <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60 select-none">
        {projectId}
       </span>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-10 md:pt-14 pb-12 md:pb-16">
       {/* HERO */}
       <div className="relative">
        {/* Accent spine */}
        <div
         className="absolute top-1.5 right-0 w-1 h-14 md:h-16 rounded-full"
         style={{ background: accent }}
        />
        <div className="pr-5 md:pr-7 space-y-5 md:space-y-6">
         <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3 text-xs md:text-sm font-bold"
         >
          <span style={{ color: accent }}>{display.category}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span className="text-muted-foreground">{display.role}</span>
         </motion.div>
         <motion.h2
          id={titleId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black font-display leading-[1.05] tracking-tight text-foreground"
         >
          {display.title}
         </motion.h2>
         <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
         >
          {display.desc}
         </motion.p>
        </div>
       </div>

       {display.slug && (
        <a
         href={`/projects/${display.slug}`}
         className="inline-flex items-center gap-2 mt-8 text-sm font-black font-display text-primary hover:opacity-80 transition-opacity"
        >
         مشاهدهٔ صفحهٔ کامل پروژه ↗
        </a>
       )}

       {/* MEDIA — clearly defined slot for project imagery */}
       <div className="mt-10 md:mt-12">
        {hasImages ? (
         <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 snap-x" dir="ltr">
          {display.images!.map((src, i) => (
           <div
            key={i}
            className="relative flex-none w-[85%] md:w-[62%] aspect-[16/9] rounded-2xl md:rounded-[1.75rem] overflow-hidden border border-border bg-secondary/30 snap-start"
           >
            <Image
             src={src}
             alt={`${display.title} — ${i + 1}`}
             fill
             sizes="(max-width: 768px) 85vw, 62vw"
             className="object-cover"
            />
           </div>
          ))}
         </div>
        ) : (
         <div className="relative aspect-[16/9] w-full rounded-2xl md:rounded-[1.75rem] overflow-hidden border border-border bg-secondary/20">
          <div
           className="absolute inset-0"
           style={{ background: `radial-gradient(120% 100% at 50% 0%, ${accentSoft}, transparent 70%)` }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground/50">
           <ImageIcon className="w-7 h-7" />
           <span className="text-xs font-sans">پیش‌نمایش پروژه به‌زودی اضافه می‌شود</span>
          </div>
         </div>
        )}
       </div>

       {/* METRICS READOUT — signature data band (real metrics only) */}
       {hasMetrics && (
        <div className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border-y border-border overflow-hidden">
         {display.metrics.map((metric, i) => (
          <div key={i} className="bg-card px-5 py-6 md:py-8 flex flex-col gap-2">
           <div
            className="text-4xl md:text-5xl font-black font-display leading-none tabular-nums"
            style={{ color: accent }}
           >
            {formatMetric(metric.value)}
           </div>
           <div className="text-xs text-muted-foreground">{metric.label}</div>
          </div>
         ))}
        </div>
       )}

       {/* DETAIL GRID */}
       <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Spec sheet */}
        <div className="lg:col-span-7 space-y-7">
         <SectionLabel accent={accent}>مشخصات پروژه</SectionLabel>
         <dl className="divide-y divide-border border-y border-border">
          {spec.map((row, i) => (
           <div key={i} className="flex items-baseline justify-between gap-6 py-4">
            <dt className="text-sm text-muted-foreground shrink-0">{row.label}</dt>
            <dd className="text-base md:text-lg font-bold font-display text-foreground text-left">
             {row.value}
            </dd>
           </div>
          ))}
          <div className="flex items-center justify-between gap-6 py-4">
           <dt className="text-sm text-muted-foreground shrink-0">وضعیت</dt>
           <dd className="flex items-center gap-2.5 text-base md:text-lg font-bold font-display text-foreground">
            <span className="relative flex w-2 h-2">
             <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400/60 animate-ping" />
             <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            عملیاتی
           </dd>
          </div>
         </dl>
        </div>

        {/* Tech stack */}
        <div className="lg:col-span-5 space-y-7 lg:border-r lg:border-border lg:pr-12">
         {display.tech && display.tech.length > 0 && (
          <div className="space-y-5">
           <SectionLabel accent={accent}>پشته فناوری</SectionLabel>
           <div className="flex flex-wrap gap-2" dir="ltr">
            {display.tech.map((t, i) => (
             <span
              key={i}
              className="px-3.5 py-2 rounded-xl bg-secondary border border-border text-[11px] font-bold text-foreground flex items-center gap-2"
             >
              <TechIcon name={t} />
              {t}
             </span>
            ))}
           </div>
          </div>
         )}

         <div className="pt-4 flex items-center gap-3 opacity-30">
          <Logo className="w-9 h-9" />
          <span className="font-display text-sm font-bold text-foreground">گروه فناوری بقایی</span>
         </div>
        </div>
       </div>
      </div>
     </div>
    </motion.div>
   </div>
  </div>,
  document.body
 );
}
