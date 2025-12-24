'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:max-w-md z-[150]"
        >
          <div className="bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[60px] rounded-full group-hover:bg-white/10 transition-colors duration-700" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-white">حریم خصوصی و داده‌ها</h3>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed font-sans text-justify">
                ما برای بهبود تجربه کاربری و تحلیل ترافیک از کوکی‌ها استفاده می‌کنیم. ورود شما به سایت به معنای پذیرش سیاست‌های مهندسی داده ماست. برای اطلاعات بیشتر <Link href="/privacy" className="text-white underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors">سند حریم خصوصی</Link> را مطالعه کنید.
              </p>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-white text-black py-3 rounded-full font-black font-display text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  می‌پذیرم
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 border border-white/10 text-zinc-500 rounded-full font-bold font-display text-xs hover:bg-white/5 hover:text-white transition-all"
                >
                  رد کردن
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 left-4 text-zinc-700 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
