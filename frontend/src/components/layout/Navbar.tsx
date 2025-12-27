"use client";
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { AnimatePresence, motion } from 'framer-motion';
import { NavItem } from '../ui/NavItem';
import { Menu, ChevronDown, PenTool, Keyboard, RotateCw as SpinIcon, Layout, Globe, Briefcase, Sparkles } from 'lucide-react';
import { useSound } from '@/lib/utils/sounds';
import { ThemeToggle } from './ThemeToggle';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
 { id: 'hero', label: 'خانه' },
 { id: 'philosophy', label: 'فلسفه ما' },
 { id: 'products', label: 'محصولات', hasDropdown: true },
 { id: 'services', label: 'خدمات' },
 { id: 'testimonials', label: 'اعتماد مشتریان' },
 { id: 'contact', label: 'ارتباط' },
];

const toolsData = [
  { id: 'cheque-nevis', name: 'دستیار چک‌نویس', desc: 'مبدل هوشمند عدد به حروف فارسی جهت نوشتن دقیق چک و اسناد مالی.', icon: PenTool, href: 'https://tools.baghaei.com/cheque-nevis' },
  { id: 'type-jangi', name: 'تایپِ جنگی', desc: 'سنجش سرعت تایپ با چاشنی هیجان و دیالوگ‌های ماندگار سینمای ایران.', icon: Keyboard, href: 'https://tools.baghaei.com/type-jangi' },
  { id: 'spin-win', name: 'چرخونه تصمیم', desc: 'ابزاری سرگرم‌کننده برای تصمیم‌گیری‌های سخت با چرخونه شانس و افکت‌های جذاب.', icon: SpinIcon, href: 'https://tools.baghaei.com/spin-win' },
];

const featuredProjects = [
  { id: 'ravaro', name: 'پلتفرم راورو', desc: 'بزرگترین پلتفرم باگ‌بانتی و امنیت سایبری در مقیاس ملی.', icon: Globe },
  { id: 'malata', name: 'پلتفرم مالاتا', desc: 'بازار آنلاین مستقیم محصولات دریایی و صیادی.', icon: Briefcase },
  { id: 'royal', name: 'رویال اقدسیه', desc: 'هویت دیجیتال و مدیریت یکی از لوکس‌ترین باشگاه‌های کشور.', icon: Layout },
];

export default function Navbar() {
 const [scrolled, setScrolled] = useState(false);
 const [activeSection, setActiveSection] = useState('hero');
 const [isToolsOpen, setIsToolsOpen] = useState(false);
 const { play } = useSound();
 const pathname = usePathname();
 const router = useRouter();

 useEffect(() => {
  if (pathname !== '/') return;
  const handleScroll = () => {
   setScrolled(window.scrollY > 20);
   const sectionIds = [...navLinks.map(l => l.id), 'projects', 'tools'];
   const sections = sectionIds.map(id => document.getElementById(id));
   const currentSection = sections.find(section => {
    if (!section) return false;
    const rect = section.getBoundingClientRect();
    return rect.top <= 100 && rect.bottom >= 100;
   });
   if (currentSection) {
    // Map projects and tools sections to the 'products' nav item
    if (currentSection.id === 'projects' || currentSection.id === 'tools') {
     setActiveSection('products');
    } else {
     setActiveSection(currentSection.id);
    }
   }
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
  }
 };

 const isActive = scrolled || pathname !== '/';

 return (
  <nav 
   className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
    isActive 
     ? 'py-4 bg-background/80 backdrop-blur-md border-b border-border' 
     : 'py-8 bg-transparent border-b border-transparent'
   }`} 
   onMouseLeave={() => setIsToolsOpen(false)}
   role="navigation"
  >
   <div className="max-w-7xl mx-auto px-6 lg:px-16 flex justify-between items-center relative z-10">
    {/* Brand */}
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
     <Logo className="w-8 h-8 text-foreground" />
     <span className="text-base md:text-lg font-bold text-foreground uppercase hidden sm:inline-block font-display">گروه فناوری بقایی</span>
    </Link>

    {/* Center Links */}
    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
     <div className="flex gap-8 text-[13px] font-bold uppercase text-muted-foreground">
      {navLinks.map((link) => (
       <div 
        key={link.id} 
        onMouseEnter={() => link.hasDropdown ? setIsToolsOpen(true) : setIsToolsOpen(false)}
        className="relative"
       >
        <NavItem 
         label={link.label}
         isActive={activeSection === link.id}
         onClick={() => !link.hasDropdown && scrollTo(link.id)}
         className={`flex items-center gap-1 ${link.hasDropdown ? 'cursor-default' : ''}`}
        />
        {link.hasDropdown && (
         <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''} absolute left-[-14px] top-1/2 -translate-y-1/2`} />
        )}
       </div>
      ))}
     </div>
    </div>

    {/* Actions */}
    <div className="hidden md:flex items-center gap-6">
     <div className="flex items-center gap-5">
      <div className="h-6 w-px bg-border" />
      <ThemeToggle />
      <div className="h-6 w-px bg-border" />
     </div>
     
     <button 
      onClick={() => { play('pop'); scrollTo('contact'); }} 
      onMouseEnter={() => play('hover')}
      className="px-8 py-2.5 bg-primary text-primary-foreground text-[10px] font-display uppercase rounded-full hover:scale-105 active:scale-95 transition-all"
      style={{ fontWeight: 500 }}
     >
      شروع همکاری
     </button>
    </div>

    <div className="md:hidden flex items-center gap-4 relative z-[210]">
     <ThemeToggle />
     <button 
      onClick={() => {
       window.dispatchEvent(new CustomEvent('toggle-mobile-menu'));
      }} 
      className="p-3 bg-primary text-primary-foreground rounded-full active:scale-90 transition-transform shadow-xl"
     >
      <Menu className="w-5 h-5" />
     </button>
    </div>
   </div>

   {/* Products Dropdown */}
   <AnimatePresence>
    {isToolsOpen && (
     <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl z-0"
     >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 grid grid-cols-1 md:grid-cols-2 gap-16" dir="rtl">
        {/* Projects Column */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <Layout className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-black uppercase text-foreground">پروژه‌های شاخص</h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {featuredProjects.map((project) => (
              <button 
                key={project.id} 
                onClick={() => { setIsToolsOpen(false); scrollTo('projects'); }}
                className="p-5 rounded-2xl bg-secondary/30 border border-transparent hover:bg-secondary hover:border-border transition-all cursor-pointer group flex items-start gap-4 text-right"
              >
                <div className="w-10 h-10 rounded-xl bg-muted/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <project.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{project.name}</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">{project.desc}</div>
                </div>
              </button>
            ))}
            
            <button 
              onClick={() => { setIsToolsOpen(false); scrollTo('projects'); }}
              className="w-full py-4 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase text-center border-t border-border/50 mt-2"
            >
              مشاهده تمامی پروژه‌ها →
            </button>
          </div>
        </div>

        {/* Tools Column */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-black uppercase text-foreground">ابزارهای هوشمند</h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {toolsData.map((tool) => (
              <a 
                key={tool.id} 
                href={tool.href}
                onClick={() => setIsToolsOpen(false)}
                className="p-5 rounded-2xl bg-secondary/30 border border-transparent hover:bg-secondary hover:border-border transition-all cursor-pointer group flex items-start gap-4 text-right"
              >
                <div className="w-10 h-10 rounded-xl bg-muted/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <tool.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{tool.name}</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">{tool.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
     </motion.div>
    )}
   </AnimatePresence>
  </nav>
 );
}
