import React from 'react';
import { headers } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Projects from '@/components/home/Projects';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';
import Contact from '@/components/home/Contact';
import Maintenance from '@/components/layout/Maintenance';

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isBeta = host.startsWith('beta.');

  if (!isBeta) {
    return <Maintenance />;
  }

  return (
    <main className="min-h-screen bg-white selection:bg-zinc-200">
      <Navbar />
      <Hero />
      <div className="space-y-16 pb-32">
        <Projects />
        <Testimonials />
        <Services />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
