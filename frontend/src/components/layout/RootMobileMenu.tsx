'use client';

import React, { useState, useEffect } from 'react';
import { MobileMenu } from '../ui/MobileMenu';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { id: 'hero', label: 'خانه' },
  { id: 'philosophy', label: 'فلسفه ما' },
  { id: 'projects', label: 'پروژه‌ها' },
  { id: 'services', label: 'خدمات' },
  { id: 'testimonials', label: 'اعتماد مشتریان' },
  { id: 'contact', label: 'ارتباط' },
];

export function RootMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-mobile-menu', handleToggle);
    return () => window.removeEventListener('toggle-mobile-menu', handleToggle);
  }, []);

  const scrollTo = (id: string) => {
    setIsOpen(false);
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
    <MobileMenu 
      isOpen={isOpen} 
      links={navLinks} 
      onClose={() => setIsOpen(false)} 
      onLinkClick={scrollTo} 
    />
  );
}
