'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Philosophy from '@/components/home/Philosophy';
import Projects from '@/components/home/Projects';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';
import Contact from '@/components/home/Contact';
import Footer from '@/components/layout/Footer';

export default function HomeContent() {
 return (
  <main className="min-h-screen relative bg-background overflow-x-hidden">
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
