'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytical: true,
    functional: true
  });

  useEffect(() => {
    // Robust client-side check
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent-v10');
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1000); // 1 second delay
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent-v10', JSON.stringify({ all: true, ...preferences }));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent-v10', JSON.stringify(preferences));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:right-auto md:left-12 md:max-w-md z-[9999]"
        >
          <div className="bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-display text-white">تنظیمات داده‌ها</h3>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-zinc-600 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed font-sans text-justify">
                ما برای بهینه‌سازی تجربه مهندسی شما از داده‌ها استفاده می‌کنیم. می‌توانید انتخاب کنید کدام دسته از کوکی‌ها فعال باشند. اطلاعات بیشتر در <Link href="/privacy" className="text-white underline decoration-white/20">سند حریم خصوصی</Link>.
              </p>

              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-[10px] font-bold text-zinc-300 font-display">کوکی‌های ضروری (غیرقابل تغییر)</div>
                    <div className="w-4 h-4 rounded-full bg-zinc-700" />
                  </div>
                  <button 
                    onClick={() => setPreferences(p => ({ ...p, analytical: !p.analytical }))}
                    className="w-full flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="text-[10px] font-bold text-zinc-300 font-display">تحلیل ترافیک و رفتار</div>
                    <div className={`w-4 h-4 rounded-full transition-colors ${preferences.analytical ? 'bg-white' : 'bg-zinc-800'}`} />
                  </button>
                  <button 
                    onClick={() => setPreferences(p => ({ ...p, functional: !p.functional }))}
                    className="w-full flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="text-[10px] font-bold text-zinc-300 font-display">شخصی‌سازی و عملکرد</div>
                    <div className={`w-4 h-4 rounded-full transition-colors ${preferences.functional ? 'bg-white' : 'bg-zinc-800'}`} />
                  </button>
                </motion.div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={isExpanded ? handleSavePreferences : handleAcceptAll}
                  className="w-full bg-white text-black py-3.5 rounded-full font-black font-display text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  {isExpanded ? 'ذخیره تنظیمات' : 'تایید و قبول همه'}
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full py-3 text-zinc-500 font-bold font-display text-[10px] flex items-center justify-center gap-2 hover:text-white transition-colors"
                >
                  {isExpanded ? 'بستن تنظیمات' : 'شخصی‌سازی گزینه‌ها'}
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
