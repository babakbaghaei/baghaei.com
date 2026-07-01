'use client';

/**
 * پاپ‌آپ قصد-خروج (R51 — CRO). فقط روی دسکتاپ (اشاره‌گر دقیق) و یک‌بار در هر نشست:
 * وقتی نشانگر ماوس از لبهٔ بالای پنجره بیرون می‌رود (قصد بستن/رفتن)، یک پیشنهاد
 * کوتاهِ «مشاورهٔ رایگان» نشان می‌دهد تا کاربر پیش از ترک، مسیر تماس را ببیند.
 * روی لمسی هرگز فعال نمی‌شود (نشانگری نیست) و با sessionStorage تکرار نمی‌شود.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, ArrowLeft, X, Gift } from 'lucide-react';
import { Button } from '../ui/Button';

const SESSION_KEY = 'exit-intent-shown';

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // فقط دستگاه‌های با اشاره‌گر دقیق (دسکتاپ) — لمسی رویداد خروج از بالا ندارد.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return;

    let shown = false;
    try {
      shown = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* storage disabled — treat as not shown */
    }
    if (shown) return;

    const onMouseOut = (e: MouseEvent) => {
      // خروج واقعی از پنجره به‌سمت بالا: نشانگر مقصدی داخل صفحه ندارد و y ≤ 0 است.
      if (!e.relatedTarget && e.clientY <= 0) {
        setOpen(true);
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          /* ignore */
        }
        document.removeEventListener('mouseout', onMouseOut);
      }
    };

    // تأخیر کوتاه تا روی بارگذاری اولیه یا حرکت‌های سریعِ ابتدایی فعال نشود.
    const armTimer = window.setTimeout(() => {
      document.addEventListener('mouseout', onMouseOut);
    }, 5000);

    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="no-print fixed inset-0 z-[320] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="پیشنهاد پیش از خروج"
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
              aria-label="بستن"
              className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Gift className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-black text-foreground">یک لحظه صبر کنید</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
              پیش از رفتن، یک <span className="font-bold text-foreground">مشاورهٔ اولیهٔ رایگان</span> دربارهٔ
              ایده یا پروژه‌تان بگیرید. فرم را پر کنید یا مستقیم تماس بگیرید؛ در کوتاه‌ترین زمان پاسخ می‌دهیم.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/#contact" onClick={() => setOpen(false)} className="w-full">
                <Button className="w-full rounded-full py-4" rightIcon={<ArrowLeft className="h-4 w-4" />}>
                  دریافت مشاورهٔ رایگان
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
