"use client";
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { AnimatePresence, motion } from 'framer-motion';
import { NavItem } from '../ui/NavItem';
import { Menu, ChevronDown, Layout, Globe, Briefcase, Sparkles, Plane, Car, ArrowLeft, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { TOOLS, TOOL_CATEGORIES, getCategoryMeta } from '@/lib/data/tools';
import { Button } from '../ui/Button';
import { navLinks } from '@/lib/nav';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const featuredProjects = [
  { id: 'ravaro', name: 'پلتفرم راورو', desc: 'بزرگترین پلتفرم باگ‌بانتی و امنیت سایبری در مقیاس ملی.', icon: Globe },
  { id: 'malata', name: 'پلتفرم مالاتا', desc: 'بازار آنلاین مستقیم محصولات دریایی و صیادی.', icon: Briefcase },
  { id: 'fids', name: 'FIDS فرودگاه کیش', desc: 'سیستم نمایش اطلاعات پرواز و رابط کانترهای فرودگاه بین‌المللی کیش.', icon: Plane },
  { id: 'kevany', name: 'تیونینگ کیوانی', desc: 'پلتفرم پیکربندی خودروهای فوق‌لوکس برای برند جهانی Kevany.', icon: Car },
  { id: 'royal', name: 'رویال اقدسیه', desc: 'هویت دیجیتال و مدیریت یکی از لوکس‌ترین باشگاه‌های کشور.', icon: Layout },
];

export default function Navbar() {
 const [scrolled, setScrolled] = useState(false);
 const [activeSection, setActiveSection] = useState('hero');
 const [openMenu, setOpenMenu] = useState<string | null>(null);
 const pathname = usePathname();
 const router = useRouter();

 const isSubPage = pathname !== '/';

 useEffect(() => {
  // Sub-pages have no hero behind the bar — their solid look and active item
  // are derived during render (see below), so the scroll spy only runs at home.
  if (isSubPage) return;
  const handleScroll = () => {
   setScrolled(window.scrollY > 20);
   // navLinks already use the real section element ids (e.g. 'projects').
   const sectionIds = navLinks.map(l => l.id);
   const sections = sectionIds.map(id => document.getElementById(id));
   const currentSection = sections.find(section => {
    if (!section) return false;
    const rect = section.getBoundingClientRect();
    return rect.top <= 100 && rect.bottom >= 100;
   });
   if (currentSection) {
    setActiveSection(currentSection.id);
   }
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
 }, [isSubPage]);

 // Derived display state — keeps the bar solid and the right item highlighted on
 // sub-pages without synchronously calling setState inside an effect.
 const isSolid = isSubPage || scrolled;
 const currentActive = pathname.startsWith('/tools')
  ? 'tools'
  : pathname.startsWith('/about')
  ? 'about'
  : activeSection;

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

 return (
  <nav
   aria-label="ناوبری اصلی"
   onBlur={(e) => {
    // Close the mega-menu once focus leaves the whole nav (keyboard users).
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
   }}
   onKeyDown={(e) => { if (e.key === 'Escape') setOpenMenu(null); }}
   className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isSolid ? 'py-4' : 'py-8'} ${
    openMenu
     ? 'bg-background border-b border-border shadow-sm'
     : isSolid
     ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
     : 'bg-transparent'
   }`}
  >
   <div className="max-w-7xl mx-auto px-6 lg:px-16 flex items-center justify-between">
    {/* Brand — internal home link so staging/localhost/preview route home. */}
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
     <Logo className="w-8 h-8 text-foreground" />
     <span className="text-base md:text-lg font-bold text-foreground uppercase hidden sm:inline-block font-display">گروه فناوری بقایی</span>
    </Link>

    {/* Center Links */}
    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
     <div className="flex gap-8 text-[13px] font-bold uppercase text-muted-foreground">
      {navLinks.map((link) => (
       <div
        key={link.id}
        onMouseEnter={() => setOpenMenu(link.hasDropdown ? link.id : null)}
        onFocus={() => setOpenMenu(link.hasDropdown ? link.id : null)}
        className="relative"
       >
        <NavItem
         label={link.label}
         isActive={currentActive === link.id}
         aria-haspopup={link.hasDropdown ? 'menu' : undefined}
         aria-expanded={link.hasDropdown ? openMenu === link.id : undefined}
         onClick={() => {
          if (link.id === 'tools') { router.push('/tools'); return; }
          if (link.id === 'about') { router.push('/about'); return; }
          if (!link.hasDropdown) scrollTo(link.id);
         }}
         className={`flex items-center gap-1 ${link.hasDropdown && link.id !== 'tools' ? 'cursor-default' : ''}`}
        />
        {link.hasDropdown && (
         <ChevronDown aria-hidden="true" className={`w-3 h-3 transition-transform duration-300 ${openMenu === link.id ? 'rotate-180' : ''} absolute end-[-14px] top-1/2 -translate-y-1/2`} />
        )}
       </div>
      ))}
     </div>
    </div>

    {/* Actions */}
    <div className="hidden md:flex items-center gap-6">
     <div className="flex items-center gap-3">
      <div className="h-6 w-px bg-border" />
      <button
       type="button"
       onClick={() => window.dispatchEvent(new CustomEvent('command-menu:open'))}
       aria-label="جستجو (Ctrl+K)"
       className="flex h-9 items-center gap-2 rounded-full px-2.5 text-muted-foreground outline-none transition-colors hover:text-foreground hover:bg-secondary focus-visible:ring-2 focus-visible:ring-primary/50"
      >
       <Search aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.8} />
      </button>
      <ThemeToggle />
      <div className="h-6 w-px bg-border" />
     </div>

     <Button
      onClick={() => { scrollTo('contact'); }}
      size="sm"
      className="uppercase"
     >
      شروع همکاری
     </Button>
    </div>

    <div className="md:hidden flex items-center gap-4 relative z-[210]">
     <ThemeToggle />
     <button
      onClick={() => {
       window.dispatchEvent(new CustomEvent('toggle-mobile-menu'));
      }}
      aria-label="باز کردن منو"
      aria-haspopup="menu"
      className="p-3 bg-primary text-primary-foreground rounded-full active:scale-90 transition-transform shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
     >
      <Menu aria-hidden="true" className="w-5 h-5" />
     </button>
    </div>

    {/* Mega Dropdown — separate panels for محصولات، ابزارها و خدمات */}
    <AnimatePresence>
     {openMenu && (
      <motion.div
       role="region"
       aria-label={openMenu === 'projects' ? 'محصولات و پلتفرم‌ها' : 'جعبه ابزار'}
       initial={{ opacity: 0, y: -10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
       onMouseLeave={() => setOpenMenu(null)}
       className="absolute top-full start-0 w-full bg-background border-b border-border shadow-2xl z-0"
      >
       <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12" dir="rtl">
         {openMenu === 'projects' ? (
           /* Products / Projects */
           <div className="grid grid-cols-1 md:grid-cols-[0.85fr_2fr] gap-10 lg:gap-16">
             {/* intro */}
             <div className="flex flex-col justify-between gap-6 md:border-e md:border-border/50 md:pe-10">
               <div className="space-y-3">
                 <div className="flex items-center gap-2.5">
                   <Layout className="w-4 h-4 text-primary" />
                   <h4 className="text-sm font-black uppercase text-foreground">محصولات و پلتفرم‌ها</h4>
                 </div>
                 <p className="text-[12px] text-muted-foreground leading-relaxed">
                   منتخبی از پلتفرم‌ها و محصولاتی که از ایده تا اجرا طراحی، توسعه و راه‌اندازی کرده‌ایم.
                 </p>
               </div>
               <Link
                 href="/projects"
                 onClick={() => setOpenMenu(null)}
                 className="inline-flex items-center gap-2 text-xs font-black font-display text-primary transition-all hover:gap-3 self-start"
               >
                 مشاهده همهٔ پروژه‌ها
                 <ArrowLeft aria-hidden="true" className="w-4 h-4" />
               </Link>
             </div>
             {/* projects grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {featuredProjects.map((project) => (
                 <button
                   key={project.id}
                   onClick={() => { setOpenMenu(null); scrollTo('projects'); }}
                   className="p-4 rounded-2xl bg-secondary/30 border border-transparent hover:bg-secondary hover:border-border transition-all cursor-pointer group flex items-start gap-3.5 text-right"
                 >
                   <div className="w-10 h-10 rounded-xl bg-muted/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                     <project.icon className="w-5 h-5 text-foreground" />
                   </div>
                   <div>
                     <div className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{project.name}</div>
                     <div className="text-xs text-foreground/70 leading-relaxed line-clamp-2">{project.desc}</div>
                   </div>
                 </button>
               ))}
             </div>
           </div>
         ) : (
           /* Tools — full toolbox by category */
           <div className="grid grid-cols-1 md:grid-cols-[0.85fr_2fr] gap-10 lg:gap-16">
             {/* intro */}
             <div className="flex flex-col justify-between gap-6 md:border-e md:border-border/50 md:pe-10">
               <div className="space-y-3">
                 <div className="flex items-center gap-2.5">
                   <Sparkles className="w-4 h-4 text-primary" />
                   <h4 className="text-sm font-black uppercase text-foreground">جعبه ابزار</h4>
                 </div>
                 <p className="text-[12px] text-muted-foreground leading-relaxed">
                   مجموعه‌ای رو به رشد از ابزارهای حقوقی، مالی و کاربردی؛ رایگان و کاملاً آفلاین در مرورگر شما.
                 </p>
               </div>
               <Link
                 href="/tools"
                 onClick={() => setOpenMenu(null)}
                 className="inline-flex items-center gap-2 text-xs font-black font-display text-primary transition-all hover:gap-3 self-start"
               >
                 مشاهده جعبه ابزار
                 <ArrowLeft aria-hidden="true" className="w-4 h-4" />
               </Link>
             </div>
             {/* categories grid */}
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
               {TOOL_CATEGORIES.map((cat) => {
                 const meta = getCategoryMeta(cat);
                 const CatIcon = meta.icon;
                 const items = TOOLS.filter((t) => t.category === cat && t.status !== 'soon').slice(0, 4);
                 if (items.length === 0) return null;
                 return (
                   <div key={cat} className="space-y-3">
                     <div className="flex items-center gap-2">
                       <span
                         className="flex h-6 w-6 items-center justify-center rounded-lg shrink-0"
                         style={{ background: `rgba(${meta.color}, 0.12)`, color: `rgb(${meta.color})` }}
                       >
                         <CatIcon className="h-3.5 w-3.5" strokeWidth={1.9} />
                       </span>
                       <h5 className="text-[12px] font-black font-display text-foreground">{cat}</h5>
                     </div>
                     <ul className="space-y-1.5 ps-1">
                       {items.map((t) => (
                         <li key={t.slug}>
                           <Link
                             href={`/tools/${t.slug}`}
                             onClick={() => setOpenMenu(null)}
                             className="block truncate text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                           >
                             {t.title}
                           </Link>
                         </li>
                       ))}
                     </ul>
                   </div>
                 );
               })}
             </div>
           </div>
         )}
       </div>
      </motion.div>
     )}
    </AnimatePresence>
   </div>
  </nav>
 );
}