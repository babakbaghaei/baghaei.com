import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Projects from '@/components/home/Projects';
import Contact from '@/components/home/Contact';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
