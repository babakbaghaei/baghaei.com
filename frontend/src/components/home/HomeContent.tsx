'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Client-only dynamic imports to prevent hydration issues with scroll refs
const Navbar = dynamic(() => import('@/components/layout/Navbar'), { ssr: false });
const Hero = dynamic(() => import('@/components/home/Hero'), { ssr: false });
const Philosophy = dynamic(() => import('@/components/home/Philosophy'), { ssr: false });
const Projects = dynamic(() => import('@/components/home/Projects'), { ssr: false });
const Services = dynamic(() => import('@/components/home/Services'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: false });
const Contact = dynamic(() => import('@/components/home/Contact'), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });

export default function HomeContent() {
  return (
    <main className="min-h-screen relative bg-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <div className="space-y-0">
        <Philosophy />
        <Projects />
        <Services />
        <Testimonials />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
