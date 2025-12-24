'use client';

import React from 'react';
import { Mail, Phone, Instagram, Send, Linkedin, Github } from 'lucide-react';
import Logo from './Logo';
import { toPersianDigits } from '@/lib/utils/format';

const socialLinks = [
  { icon: Mail, href: 'mailto:baabakbaghaaei@gmail.com', label: 'Email' },
  { icon: Linkedin, href: 'https://linkedin.com/in/babakbaghaei', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/babakbaghaei', label: 'GitHub' },
  { icon: Send, href: 'https://t.me/babak_bagha_ei', label: 'Telegram' },
  { icon: Instagram, href: 'https://instagram.com/babak__baghaei', label: 'Instagram' },
];

const navGroups = [
  {
    title: 'Navigation',
    links: [
      { label: 'خانه', href: '#hero' },
      { label: 'خدمات و تخصص', href: '#services' },
      { label: 'پروژه‌های منتخب', href: '#projects' },
      { label: 'فلسفه و رویکرد', href: '#philosophy' },
      { label: 'نظرات مشتریان', href: '#testimonials' },
      { label: 'شروع همکاری', href: '#contact' },
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-black pt-60 pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-32 mb-40">
          {/* Brand Info */}
          <div className="space-y-12 max-w-xl">
            <div className="flex items-center gap-6 text-right">
              <Logo className="w-16 h-16" />
              <h3 className="text-4xl font-black font-display text-white uppercase leading-none">
                گروه فناوری <br />بقایی.
              </h3>
            </div>
            <p className="text-lg md:text-xl text-zinc-400 font-sans leading-loose text-justify pl-8 border-l border-zinc-800/50">
              گروه فناوری بقایی از سال ۱۳۹۴ با تمرکز بر مهندسی دقیق و معماری سیستم‌های توزیع‌شده، همراه کسب‌وکارهای بزرگ در مسیر تحول دیجیتال بوده است. ماموریت ما ارتقای سطح کیفی نرم‌افزار در مقیاس سازمانی است.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 md:gap-24 flex-1">
            {/* Nav Links */}
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-10 text-right">
                <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">{group.title}</h4>
                <div className="flex flex-col gap-6 text-xl font-bold font-display text-white">
                  {group.links.map((link) => (
                    <a key={link.label} href={link.href} className="hover:text-zinc-400 transition-all">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact Info */}
            <div className="space-y-10 text-left flex flex-col items-end w-full">
              <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] self-end text-right">Contact</h4>
              <div className="flex flex-col gap-6 text-xl font-display text-white w-full items-end">
                <a href="tel:+989115790013" className="flex items-center justify-end gap-3 hover:text-zinc-400 transition-all font-display font-medium text-lg md:text-xl whitespace-nowrap" dir="ltr">
                  <span>{toPersianDigits('+۹۸ ۹۱۱ ۵۷۹ ۰۰۱۳')}</span>
                  <Phone className="w-5 h-5 text-zinc-500" />
                </a>
                
                <div className="flex flex-wrap gap-4 pt-6 justify-end w-full">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.label}
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-white hover:!text-black transition-all"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Background Text */}
        <div className="text-[15vw] font-black text-zinc-900/50 leading-none select-none pointer-events-none mb-12 tracking-tighter">
          BAGHAEI TECH
        </div>

        {/* Copyright */}
        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-black text-zinc-700 uppercase tracking-wider text-center md:text-right font-display">
            &copy; {toPersianDigits(1404)} تمامی حقوق برای گروه فناوری بقایی محفوظ است.
          </div>
          <div className="flex gap-12 text-[10px] font-black text-zinc-600 uppercase">
            <a href="/terms" className="hover:text-white cursor-pointer transition-colors font-display">شرایط استفاده</a>
            <a href="/privacy" className="hover:text-white cursor-pointer transition-colors font-display">حریم خصوصی</a>
          </div>
        </div>
      </div>
    </footer>
  );
}