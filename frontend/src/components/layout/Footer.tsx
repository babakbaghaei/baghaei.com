import React from 'react';
import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';
import Logo from './Logo';
import { SocialLinks } from '../ui/SocialLinks';
import { FooterGroup } from '../ui/FooterGroup';

const footerLinks = {
 company: [
  { label: 'خانه', href: '/' },
  { label: 'ابزارها', href: '/tools' },
  { label: 'نمونه‌کار', href: '/projects' },
  { label: 'راه‌کارها و قیمت‌گذاری', href: '/pricing' },
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
     <div className="md:col-span-1 space-y-6">
      <Link href="/" className="flex items-center gap-4">
       <Logo className="w-10 h-10 text-foreground" />
       <span className="text-xl font-bold font-display text-foreground">گروه فناوری بقائی</span>
      </Link>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-display">
       استودیوی مهندسی محصول و طراحی؛ از ایده تا اجرا، با وسواس روی کیفیت، امنیت و تجربهٔ کاربری.
      </p>
      <ul className="space-y-2.5 text-sm text-muted-foreground font-display">
       <li>
        <a href="tel:+989115790013" dir="ltr" className="inline-flex flex-row-reverse items-center gap-2 hover:text-foreground transition-colors">
         <Phone className="w-4 h-4 text-primary shrink-0" /> ۰۹۱۱ ۵۷۹ ۰۰۱۳
        </a>
       </li>
       <li className="inline-flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary shrink-0" /> مازندران، ساری
       </li>
      </ul>
     </div>

     <FooterGroup title="دسترسی سریع" links={footerLinks.company} />
     <FooterGroup title="حقوقی" links={footerLinks.legal} />
    </div>

    <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-border">
     <p className="text-muted-foreground text-xs font-display">© {new Date().getFullYear()} گروه فناوری بقائی. طراحی و توسعه با استانداردهای مهندسی.</p>
     <SocialLinks />
    </div>
   </div>
  </footer>
 );
}
