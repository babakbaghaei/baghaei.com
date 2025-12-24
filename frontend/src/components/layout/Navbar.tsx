"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useScroll, useSpring as useFramerSpring } from 'framer-motion';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { id: 'hero', label: 'خانه' },
  { id: 'philosophy', label: 'فلسفه ما' },
  { id: 'projects', label: 'پروژه‌ها' },
  { id: 'services', label: 'خدمات' },
  { id: 'careers', label: 'استخدام' },
  { id: 'contact', label: 'ارتباط' },
];

const menuVariants = {
  closed: { opacity: 0, y: "-100%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
  open: { opacity: 1, y: "0%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const pathname = usePathname();
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scaleX = useFramerSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (pathname !== '/') return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navLinks.map(link => document.getElementById(link.id));
      const currentSection = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (currentSection) setActiveSection(currentSection.id);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const scrollTo = (id: string) => {
    if (pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled || pathname !== '/' ? 'py-4 backdrop-blur-xl border-b border-zinc-900 bg-black/80' : 'py-8 bg-transparent'
      }`} 
      role="navigation"
    >
      <motion.div className="absolute top-0 left-0 right-0 h-[2px] bg-white origin-center" style={{ scaleX }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 flex justify-between items-center relative">
        <Link 
          href="/" 
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }
          }}
          className="flex items-center gap-4 group cursor-pointer relative z-[110]"
        >
          <Logo className="w-8 h-8 text-white" />
          <span className="text-base md:text-lg font-bold text-white uppercase hidden sm:inline-block font-display">گروه فناوری بقایی</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8 text-[13px] font-bold uppercase text-zinc-400">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollTo(link.id)}
                className={`relative py-2 hover:text-white transition-colors font-display ${activeSection === link.id ? 'text-white' : ''}`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div layoutId="nav-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
          
          <div className="h-6 w-px bg-zinc-800" />
          <button onClick={() => scrollTo('contact')} className="px-8 py-2.5 bg-white !text-black text-[10px] !font-black font-display uppercase rounded-full hover:scale-105 active:scale-95 transition-all">
            شروع همکاری
          </button>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-white !text-black rounded-full">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div variants={menuVariants} initial="closed" animate="open" exit="closed" className="fixed inset-0 bg-black z-[90] flex flex-col justify-center px-12">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 left-6 flex items-center gap-2 text-zinc-500">
              <span className="text-sm font-bold uppercase">بازگشت</span>
              <X className="w-6 h-6" />
            </button>
            <div className="space-y-8">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollTo(link.id)} className="text-5xl font-black font-display text-white text-right block w-full">{link.label}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
