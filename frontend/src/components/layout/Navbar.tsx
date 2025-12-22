"use client";
import React, { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-300 transition-all shadow-sm" role="navigation">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex justify-between items-center">
        <a href="#" className="logo-container flex items-center gap-4 group">
          <div className="w-7 h-7 bg-black flex items-center justify-end pr-1">
            <span className="text-white text-lg font-black font-display leading-none">B</span>
          </div>
          <span className="text-sm font-black text-black transition-opacity duration-200 opacity-100 hidden sm:inline">گروه فناوری بقایی</span>
          <span className="text-sm font-black text-black transition-opacity duration-200 sm:hidden">بقایی</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium">
          <a href="#projects" className="nav-link hover:text-black transition-all duration-300 relative py-2">پروژه‌ها</a>
          <div className="services-dropdown relative group">
            <a href="#services" className="nav-link hover:text-black transition-all duration-300 relative py-2">خدمات</a>
            {/* Dropdown implementation skipped for brevity, can be added if needed */}
          </div>
          <a href="#testimonials" className="nav-link hover:text-black transition-all duration-300 relative py-2">نظرات مشتریان</a>
          <a href="#about" className="nav-link hover:text-black transition-all duration-300 relative py-2">درباره ما</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 hover:opacity-60 transition-all" aria-label="تغییر تم">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="px-3 py-1.5 text-xs font-black border-2 border-gray-200 hover:border-black transition-all">En</button>
        </div>

        <button onClick={toggleMobileMenu} className="md:hidden p-3 hover:opacity-60 transition-all" aria-label="منو">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t-2 border-gray-200">
          <div className="px-6 py-6 space-y-5">
            <a href="#projects" onClick={toggleMobileMenu} className="block text-sm font-medium hover:text-black transition-all py-2">پروژه‌ها</a>
            <a href="#services" onClick={toggleMobileMenu} className="block text-sm font-medium hover:text-black transition-all py-2">خدمات</a>
            <a href="#about" onClick={toggleMobileMenu} className="block text-sm font-medium hover:text-black transition-all py-2">درباره ما</a>
          </div>
        </div>
      )}
    </nav>
  );
}
