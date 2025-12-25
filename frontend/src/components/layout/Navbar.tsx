"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useScroll, useSpring as useFramerSpring } from 'framer-motion';
import { NavItem } from '../ui/NavItem';
import { MobileMenu } from '../ui/MobileMenu';
import { useSound } from '@/lib/utils/sounds';
import Magnetic from '../effects/Magnetic';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { id: 'hero', label: 'خانه' },
  { id: 'philosophy', label: 'فلسفه ما' },
  { id: 'projects', label: 'پروژه‌ها' },
  { id: 'services', label: 'خدمات' },
  { id: 'testimonials', label: 'اعتماد مشتریان' },
  { id: 'contact', label: 'ارتباط' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { play } = useSound();
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
    <>
          <nav 
            className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
              scrolled || pathname !== '/' ? 'py-4 border-b border-zinc-900 bg-black' : 'py-8 bg-transparent'
            }`} 
            role="navigation"
          >
      
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex justify-between items-center relative">
          <Link 
            href="https://baghaei.com" 
            onClick={(e) => {
              if (pathname === '/' && typeof window !== 'undefined' && window.location.hostname === 'baghaei.com') {
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
                <NavItem 
                  key={link.id} 
                  label={link.label}
                  isActive={activeSection === link.id}
                  onClick={() => scrollTo(link.id)}
                />
              ))}
            </div>
            
            <div className="h-6 w-px bg-zinc-800" />
                                <Magnetic>
                                  <button 
                                    onClick={() => { play('pop'); scrollTo('contact'); }} 
                                    onMouseEnter={() => play('hover')}
                                    data-cursor="magnet"
                                    className="px-8 py-2.5 bg-white !text-black text-[10px] font-display uppercase rounded-full hover:scale-105 active:scale-95 transition-all"
                                    style={{ fontWeight: 500 }}
                                  >
                                    شروع همکاری
                                  </button>
                                </Magnetic>
                                </div>

          <div className="md:hidden flex items-center gap-4 relative z-[210]">
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('toggle-mobile-menu'));
              }} 
              className="p-3 bg-white !text-black rounded-full active:scale-90 transition-transform shadow-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
