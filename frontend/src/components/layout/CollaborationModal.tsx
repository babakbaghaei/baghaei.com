'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, ArrowLeft, X, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * پاپ‌آپ «شروع همکاری» — روی صفحه‌های غیرِ خانه (مثل ابزارها یا نمونه‌کار) که سکشن
 * تماس در دسترس نیست، همان فراخوانِ همکاریِ صفحهٔ اصلی را همان‌جا نشان می‌دهد تا
 * کاربر بدون ترک صفحه بتواند فرم تماس یا تماس تلفنی را انتخاب کند.
 */
export default function CollaborationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="شروع همکاری"
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative z-10 w-full max-w-md rounded-[2rem] border border-border bg-card/95 p-8 text-right shadow-2xl backdrop-blur-xl"
            dir="rtl"
          >
            <button
              onClick={onClose}
              aria-label="بستن"
              className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-black text-foreground">شروع همکاری</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
              ایده یا پروژه‌ای در ذهن دارید؟ فرم تماس را پر کنید یا مستقیم تماس بگیرید؛ در کوتاه‌ترین
              زمان پاسخ می‌دهیم.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/#contact" onClick={onClose} className="w-full">
                <Button className="w-full rounded-full py-4" rightIcon={<ArrowLeft className="h-4 w-4" />}>
                  رفتن به فرم تماس
                </Button>
              </Link>
              <a
                href="tel:09115790013"
                className="flex items-center justify-center gap-2 rounded-full border border-border bg-transparent py-3.5 font-display text-sm font-bold text-foreground transition-colors hover:border-foreground"
              >
                <Phone className="h-4 w-4" />
                تماس تلفنی · ۰۹۱۱۵۷۹۰۰۱۳
              </a>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70">
              <MapPin className="h-3.5 w-3.5" />
              مازندران، ساری
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
