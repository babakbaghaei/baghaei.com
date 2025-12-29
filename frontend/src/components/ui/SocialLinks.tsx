'use client';

import React from 'react';
import { Mail, Linkedin, Github, Send, Instagram, LucideIcon } from 'lucide-react';

interface SocialLink {
 icon: LucideIcon;
 href: string;
 label: string;
}

const socialLinks: SocialLink[] = [
 { icon: Mail, href: 'mailto:baabakbaghaaei@gmail.com', label: 'ایمیل' },
 { icon: Linkedin, href: 'https://linkedin.com/in/babakbaghaei', label: 'لینکدین' },
 { icon: Github, href: 'https://github.com/babakbaghaei', label: 'گیت‌هاب' },
 { icon: Send, href: 'https://t.me/babak_bagha_ei', label: 'تلگرام' },
 { icon: Instagram, href: 'https://instagram.com/babak__baghaei', label: 'اینستاگرام' },
];

export const SocialLinks: React.FC = () => {
 return (
  <div className="flex flex-wrap gap-4 pt-6 justify-end w-full">
   {socialLinks.map((social) => (
    <a 
     key={social.label}
     href={social.href} 
     target="_blank" 
     rel="noopener noreferrer" 
     className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-foreground hover:!text-background transition-all"
     aria-label={social.label}
    >
     <social.icon className="w-5 h-5" />
    </a>
   ))}
  </div>
 );
};
