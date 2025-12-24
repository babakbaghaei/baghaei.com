'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'hero', label: '01 Hero' },
  { id: 'philosophy', label: '02 Philosophy' },
  { id: 'projects', label: '03 Projects' },
  { id: 'services', label: '04 Services' },
  { id: 'testimonials', label: '05 Trust' },
  { id: 'contact', label: '06 Contact' },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-12 top-1/2 -translate-y-1/2 z-[90] hidden xl:flex flex-col gap-8 items-end">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.5em] vertical-text rotate-180"
          style={{ writingMode: 'vertical-rl' }}
        >
          {sections.find(s => s.id === activeSection)?.label}
        </motion.div>
      </AnimatePresence>
      
      <div className="flex flex-col gap-3">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`w-1 h-8 transition-all duration-500 ${
              activeSection === s.id 
                ? 'bg-black dark:bg-white h-12' 
                : 'bg-zinc-100 dark:bg-zinc-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
