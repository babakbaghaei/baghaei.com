import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { SocialLinks } from '../ui/SocialLinks';
import { FooterGroup } from '../ui/FooterGroup';

const footerLinks = {
 company: [
  { label: 'خانه', href: '/' },
  { label: 'پروژه‌ها', href: '/projects' },
  { label: 'بلاگ', href: '/blog' },
  { label: 'استخدام', href: '/careers' },
 ],
 services: [
  { label: 'معماری نرم‌افزار', href: '/#services' },
  { label: 'امنیت سایبری', href: '/#services' },
  { label: 'هوش مصنوعی', href: '/#services' },
  { label: 'توسعه وب و موبایل', href: '/#services' },
 ],
 legal: [
  { label: 'قوانین و مقررات', href: '/terms' },
  { label: 'حریم خصوصی', href: '/privacy' },
 ]
};

export default function Footer() {
 return (
  <footer className="bg-black py-20 border-t border-white/5 relative">
   <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
     <div className="md:col-span-1 space-y-8">
      <Link href="/" className="flex items-center gap-4">
       <Logo className="w-10 h-10 text-white" />
       <span className="text-xl font-bold font-display text-white">گروه فناوری بقایی</span>
      </Link>
      <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-display">
       پیشرو در مهندسی نرم‌افزار و معماری سیستم‌های سازمانی با بالاترین استانداردهای جهانی.
      </p>
     </div>

     <FooterGroup title="شرکت" links={footerLinks.company} />
     <FooterGroup title="خدمات" links={footerLinks.services} />
     <FooterGroup title="حقوقی" links={footerLinks.legal} />
    </div>

    <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
     <p className="text-zinc-500 text-[11px] font-display">© {new Date().getFullYear()} گروه فناوری بقایی. طراحی و توسعه با استانداردهای مهندسی.</p>
     <SocialLinks />
    </div>
   </div>
  </footer>
 );
}
