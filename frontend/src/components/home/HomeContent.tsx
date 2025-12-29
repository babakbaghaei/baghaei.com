'use client';

import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Projects from '@/components/home/Projects';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';
import Contact from '@/components/home/Contact';
import Footer from '@/components/layout/Footer';
import { ServiceSkeleton } from '@/components/ui/Skeleton';
import GlobalUniverse from '@/components/effects/GlobalUniverse';

export default function HomeContent() {
 const containerRef = useRef<HTMLElement>(null);
 const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"]
 });

 return (
  <main ref={containerRef} className="min-h-screen relative">
   {/* Background Layer - Fixed and at the very back */}
   <div className="fixed inset-0 z-[-1] pointer-events-none">
    <div className="absolute inset-0 bg-background" />
    <GlobalUniverse renderBackground />
   </div>
   
   <Navbar />
   <Hero>
    <Services />
   </Hero>
   <div className="space-y-0">
    <Projects />
    <Testimonials />
    <Contact />
   </div>
   <Footer />
  </main>
 );
}