'use client';

/**
 * دکمهٔ چسبانِ «شروع همکاری» (R51 — CRO). فقط روی موبایل دیده می‌شود (روی دسکتاپ،
 * دکمهٔ همیشه‌حاضرِ نوار بالا کافی‌ست) و پس از کمی اسکرول ظاهر می‌شود؛ وقتی سکشن
 * تماس در دید است پنهان می‌ماند تا زمانی که کاربر همان‌جاست، نق نزند. در صفحهٔ اصلی
 * نرم به فرم تماس می‌رود؛ در سایر صفحات پاپ‌آپِ همکاری را باز می‌کند. بالای گوشه‌ها
 * می‌نشیند تا با ChatWidget (گوشهٔ پایین) تداخل نکند.
 */

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import CollaborationModal from './CollaborationModal';

export default function StickyCTA() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const contact = document.getElementById('contact');
      const contactNear = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setShow(y > 600 && !contactNear);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const onClick = () => {
    const contact = document.getElementById('contact');
    if (pathname === '/' && contact) {
      contact.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <div className="no-print md:hidden fixed inset-x-0 bottom-6 z-[95] flex justify-center pointer-events-none">
        <AnimatePresence>
          {show && (
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={onClick}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-black font-display text-primary-foreground shadow-2xl active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              شروع همکاری
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <CollaborationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
