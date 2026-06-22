import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface LegalLayoutProps {
 title: string;
 titleAccent: string;
 lastUpdated: string;
 children: React.ReactNode;
}

// Shared scaffold for legal pages (privacy/terms): noise-textured hero, two-part
// display title (leading word + muted accent), last-updated caption, then the
// page-specific body. Keeps the RTL/text-right treatment in one place.
export default function LegalLayout({ title, titleAccent, lastUpdated, children }: LegalLayoutProps) {
 return (
  <main className="min-h-screen bg-background text-foreground pt-48 pb-20 relative overflow-hidden">
   {/* Background Noise/Grid */}
   <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

   <Navbar />

   <div className="max-w-4xl mx-auto px-6 lg:px-16 space-y-16 relative z-10">
    <header className="space-y-6 border-b border-border pb-12">
     <h1 className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter leading-none">
      {title} <span className="text-muted-foreground">{titleAccent}</span>
     </h1>
     <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
      آخرین بروزرسانی: {lastUpdated}
     </p>
    </header>

    <div className="space-y-12 font-sans text-foreground/80 leading-loose text-lg text-right">
     {children}
    </div>
   </div>
   <Footer />
  </main>
 );
}
