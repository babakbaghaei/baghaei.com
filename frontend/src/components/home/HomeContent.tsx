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
  <main ref={containerRef} className="min-h-screen relative bg-background overflow-clip">
   <div className="fixed inset-0 z-0 pointer-events-none">
    <GlobalUniverse renderBackground />
   </div>
   
   <Navbar />
   <Hero>
    <React.Suspense fallback={<ServiceSkeleton />}>
      <Services />
    </React.Suspense>
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