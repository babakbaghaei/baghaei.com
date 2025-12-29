import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Projects from '@/components/home/Projects';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';
import Contact from '@/components/home/Contact';
import Footer from '@/components/layout/Footer';
import { ServiceSkeleton } from '@/components/ui/Skeleton';

export default function HomeContent() {
 return (
  <main className="min-h-screen relative bg-background overflow-clip">
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