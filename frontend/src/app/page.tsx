import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';

// Lazy load components to improve initial load time (Bundle Phobia optimization)
const Philosophy = dynamic(() => import('@/components/home/Philosophy'), { ssr: true });
const Projects = dynamic(() => import('@/components/home/Projects'), { ssr: true });
const Services = dynamic(() => import('@/components/home/Services'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: true });
const Contact = dynamic(() => import('@/components/home/Contact'), { ssr: true });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: true });

export default function Home() {
  return (
    <main className="min-h-screen">
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
