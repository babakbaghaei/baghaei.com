'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NavLink {
 id: string;
 label: string;
}

interface MobileMenuProps {
 isOpen: boolean;
 links: NavLink[];
 onClose: () => void;
 onLinkClick: (id: string) => void;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, links, onClose, onLinkClick }) => {
 const panelRef = useRef<HTMLDivElement>(null);
 const restoreFocusRef = useRef<HTMLElement | null>(null);

 // Body scroll-lock while open (compensate for the scrollbar gap so the page
 // behind doesn't shift). Mirrors ProjectModal.tsx.
 useEffect(() => {
  if (!isOpen) return;
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollBarWidth}px`;
  document.body.classList.add('lenis-stopped');
  return () => {
   document.body.style.overflow = '';
   document.body.style.paddingRight = '';
   document.body.classList.remove('lenis-stopped');
  };
 }, [isOpen]);

 // Accessibility: move focus into the open panel, trap Tab/Shift+Tab inside,
 // close on Escape, and restore focus to the trigger on close. Mirrors the
 // focus-trap pattern used in ProjectModal.tsx.
 useEffect(() => {
  if (!isOpen) return;
  restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;

  const root = panelRef.current;
  const focusTimer = window.setTimeout(() => {
   const first = root?.querySelector<HTMLElement>(FOCUSABLE);
   (first ?? root)?.focus();
  }, 0);

  const onKeyDown = (e: KeyboardEvent) => {
   if (e.key === 'Escape') {
    e.preventDefault();
    onClose();
    return;
   }
   if (e.key !== 'Tab') return;
   const r = panelRef.current;
   if (!r) return;
   const items = Array.from(r.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === r
   );
   if (items.length === 0) {
    e.preventDefault();
    r.focus();
    return;
   }
   const firstEl = items[0];
   const lastEl = items[items.length - 1];
   if (e.shiftKey && document.activeElement === firstEl) {
    e.preventDefault();
    lastEl.focus();
   } else if (!e.shiftKey && document.activeElement === lastEl) {
    e.preventDefault();
    firstEl.focus();
   }
  };

  document.addEventListener('keydown', onKeyDown);
  return () => {
   document.removeEventListener('keydown', onKeyDown);
   window.clearTimeout(focusTimer);
   restoreFocusRef.current?.focus?.();
  };
 }, [isOpen, onClose]);

 return (
  <AnimatePresence>
   {isOpen && (
    <motion.div
     ref={panelRef}
     role="dialog"
     aria-modal="true"
     aria-label="منوی ناوبری"
     tabIndex={-1}
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 bg-background z-[9991] outline-none"
     style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100dvh', width: '100vw' }}
    >
     <div className="relative h-full w-full flex flex-col justify-center px-12 overflow-hidden">
      <button
       onClick={onClose}
       aria-label="بستن منو"
       className="absolute top-10 left-8 flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group z-10"
      >
       <span className="text-xs font-black uppercase tracking-widest font-display">برگشت</span>
       <div className="p-2 rounded-full border border-border group-hover:border-foreground/30">
        <X aria-hidden="true" className="w-5 h-5" />
       </div>
      </button>

      <div className="space-y-6">
       {links.map((link, i) => (
        <motion.button
         key={link.id}
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: 0.1 + i * 0.05 }}
         onClick={() => onLinkClick(link.id)}
         className="text-5xl font-black font-display text-foreground text-right block w-full hover:text-muted-foreground transition-all active:scale-95"
        >
         {link.label}
        </motion.button>
       ))}
      </div>
     </div>
    </motion.div>
   )}
  </AnimatePresence>
 );
};
