"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-3' : 'bg-transparent py-5'
      }`} 
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 flex justify-between items-center">
        <a href="#" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-black text-xl font-display rounded-xl">
            ب
          </div>
          <span className="text-sm font-black text-black tracking-tight hidden sm:inline font-display">گروه فناوری بقایی</span>
        </a>

        <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-tight">
          <a href="#projects" className="text-zinc-400 hover:text-black transition-colors">پروژه‌ها</a>
          <a href="#services" className="text-zinc-400 hover:text-black transition-colors">خدمات</a>
          <a href="#contact" className="text-zinc-400 hover:text-black transition-colors">تماس با ما</a>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button className="text-[11px] font-bold text-zinc-300 hover:text-black transition-all font-en uppercase tracking-widest">
            English
          </button>
          <a href="#contact" className="px-6 py-2 bg-black text-white text-[11px] font-bold rounded-full hover:bg-zinc-800 transition-all">
            مشاوره رایگان
          </a>
        </div>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-black" aria-label="منو">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white h-screen p-8 space-y-8">
          <div className="flex flex-col gap-8 text-2xl font-black font-display">
            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-black">پروژه‌ها</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-black">خدمات</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-black">تماس با ما</a>
          </div>
        </div>
      )}
    </nav>
  );
}
