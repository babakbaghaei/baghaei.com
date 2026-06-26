import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { SocialLinks } from '../ui/SocialLinks';
import { FooterGroup } from '../ui/FooterGroup';

const footerLinks = {
 company: [
  { label: 'خانه', href: '/' },
  { label: 'ابزارها', href: '/tools' },
  { label: 'نمونه‌کار', href: '/projects' },
  { label: 'استخدام', href: '/careers' },
 ],
 legal: [
  { label: 'قوانین و مقررات', href: '/terms' },
  { label: 'حریم خصوصی', href: '/privacy' },
 ]
};

export default function Footer() {
 return (
  <footer className="bg-background py-20 border-t border-border relative">
   <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
     <div className="md:col-span-1 space-y-8">
      <Link href="/" className="flex items-center gap-4">
       <Logo className="w-10 h-10 text-foreground" />
       <span className="text-xl font-bold font-display text-foreground">گروه فناوری بقایی</span>
      </Link>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-display">
       پیشرو در مهندسی نرم‌افزار و معماری سیستم‌های سازمانی با بالاترین استانداردهای جهانی.
      </p>
     </div>

     <FooterGroup title="شرکت" links={footerLinks.company} />
     <FooterGroup title="حقوقی" links={footerLinks.legal} />
    </div>

    <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-border">
     <p className="text-muted-foreground text-xs font-display">© {new Date().getFullYear()} گروه فناوری بقایی. طراحی و توسعه با استانداردهای مهندسی.</p>
     <SocialLinks />
    </div>
   </div>
  </footer>
 );
}
