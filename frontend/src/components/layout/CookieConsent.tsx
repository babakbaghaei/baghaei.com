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
  // Robust client-side check. localStorage can throw in private mode or when
  // storage is disabled, so guard the read.
  if (typeof window !== 'undefined') {
   let consent: string | null = null;
   try {
    consent = localStorage.getItem('cookie-consent-v10');
   } catch {
    consent = null;
   }
   if (!consent) {
    const timer = setTimeout(() => setIsVisible(true), 5000); // 5 second delay
    return () => clearTimeout(timer);
   }
  }
 }, []);

 const persistConsent = (value: object) => {
  try {
   localStorage.setItem('cookie-consent-v10', JSON.stringify(value));
  } catch {
   // Ignore storage failures (private mode / disabled storage).
  }
 };

 const handleAcceptAll = () => {
  persistConsent({ all: true, ...preferences });
  setIsVisible(false);
 };

 const handleSavePreferences = () => {
  persistConsent(preferences);
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
     className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-sm z-[9999]"
    >
     <div className="bg-popover border border-border rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group">
      <div className="relative z-10 space-y-6">
       <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
         <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground">
          <ShieldCheck className="w-5 h-5" />
         </div>
         <h3 className="text-base font-bold font-display text-foreground">تنظیمات داده‌ها</h3>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground transition-colors">
         <X className="w-4 h-4" />
        </button>
       </div>

       <p className="text-muted-foreground text-xs leading-relaxed font-sans text-justify">
        ما برای بهینه‌سازی تجربه مهندسی شما از داده‌ها استفاده می‌کنیم. می‌توانید انتخاب کنید کدام دسته از کوکی‌ها فعال باشند. اطلاعات بیشتر در <Link href="/privacy" className="text-foreground underline decoration-border">سند حریم خصوصی</Link>.
       </p>

       {isExpanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3 pt-2 border-t border-border">
         <div className="flex items-center justify-between p-3 bg-secondary rounded-2xl border border-border">
          <div className="text-[10px] font-bold text-foreground font-display">کوکی‌های ضروری (غیرقابل تغییر)</div>
          <div className="w-4 h-4 rounded-full bg-muted-foreground" />
         </div>
         <button
          onClick={() => setPreferences(p => ({ ...p, analytical: !p.analytical }))}
          className="w-full flex items-center justify-between p-3 bg-secondary rounded-2xl border border-border hover:bg-muted transition-colors"
         >
          <div className="text-[10px] font-bold text-foreground font-display">تحلیل ترافیک و رفتار</div>
          <div className={`w-4 h-4 rounded-full transition-colors ${preferences.analytical ? 'bg-primary' : 'bg-muted'}`} />
         </button>
         <button
          onClick={() => setPreferences(p => ({ ...p, functional: !p.functional }))}
          className="w-full flex items-center justify-between p-3 bg-secondary rounded-2xl border border-border hover:bg-muted transition-colors"
         >
          <div className="text-[10px] font-bold text-foreground font-display">شخصی‌سازی و عملکرد</div>
          <div className={`w-4 h-4 rounded-full transition-colors ${preferences.functional ? 'bg-primary' : 'bg-muted'}`} />
         </button>
        </motion.div>
       )}

       <div className="flex flex-col gap-3 pt-2">
        <button
         onClick={isExpanded ? handleSavePreferences : handleAcceptAll}
         className="w-full bg-primary !text-primary-foreground py-3.5 rounded-full !font-black font-display text-xs uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(120,120,120,0.1)]"
        >
         {isExpanded ? 'ذخیره تنظیمات' : 'تایید و قبول همه'}
        </button>
        <button
         onClick={() => setIsExpanded(!isExpanded)}
         className="w-full py-3 text-muted-foreground font-bold font-display text-[10px] flex items-center justify-center gap-2 hover:text-foreground transition-colors"
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
