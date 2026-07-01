'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Projects from '@/components/home/Projects';
import Services from '@/components/home/Services';
import TrustStats from '@/components/home/TrustStats';
import Testimonials from '@/components/home/Testimonials';
import Contact from '@/components/home/Contact';
import Footer from '@/components/layout/Footer';

export default function HomeContent() {
 return (
  <main className="min-h-screen relative">
   <Navbar />
   <Hero>
    <Services />
   </Hero>
   <div className="space-y-0">
    <Projects />
    <TrustStats />
    <Testimonials />
    <Contact />
   </div>
   <Footer />
  </main>
 );
}
