'use client';

import React from 'react';
import { Mail, Linkedin, Github, Send, Instagram, LucideIcon } from 'lucide-react';

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { icon: Mail, href: 'mailto:baabakbaghaaei@gmail.com', label: 'Email' },
  { icon: Linkedin, href: 'https://linkedin.com/in/babakbaghaei', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/babakbaghaei', label: 'GitHub' },
  { icon: Send, href: 'https://t.me/babak_bagha_ei', label: 'Telegram' },
  { icon: Instagram, href: 'https://instagram.com/babak__baghaei', label: 'Instagram' },
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
          className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-white hover:!text-black transition-all"
          aria-label={social.label}
        >
          <social.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
};
