'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkNow = document.documentElement.classList.contains('dark');
    setIsDark(isDarkNow);
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    
    if (newDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button 
      onClick={toggle}
      className="p-4 rounded-full border border-zinc-200 dark:border-zinc-800 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 z-[120] relative group"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-white group-hover:text-yellow-400 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-black group-hover:text-zinc-600 transition-colors" />
      )}
    </button>
  );
}
