'use client';

import React, { useState, useEffect } from 'react';
import { MobileMenu } from '../ui/MobileMenu';
import { usePathname, useRouter } from 'next/navigation';
import { navLinks } from '@/lib/nav';

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
  if (id === 'tools') {
   router.push('/tools');
   return;
  }
  if (id === 'about') {
   router.push('/about');
   return;
  }
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
