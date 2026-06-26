import React from 'react';
import { CalendarClock, Mail } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface LegalLayoutProps {
 title: string;
 titleAccent: string;
 lastUpdated: string;
 children: React.ReactNode;
 /** ایمیل تماسِ پایان صفحه (در یک کارت یکدست رندر می‌شود). */
 contactEmail?: string;
 /** برچسب بالای ایمیل تماس. */
 contactLabel?: string;
}

// Shared scaffold for legal pages (privacy/terms): noise-textured hero, two-part
// display title (leading word + muted accent), a tasteful last-updated pill, the
// page-specific body, then an optional unified contact card. Keeps the RTL /
// text-right treatment — and the spacing before the footer — in one place.
export default function LegalLayout({
 title,
 titleAccent,
 lastUpdated,
 children,
 contactEmail,
 contactLabel,
}: LegalLayoutProps) {
 return (
  <main className="min-h-screen bg-background text-foreground pt-48 pb-0 relative overflow-hidden">
   {/* Background Noise/Grid */}
   <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

   <Navbar />

   <div className="max-w-4xl mx-auto px-6 lg:px-16 space-y-16 relative z-10 pb-24 md:pb-32">
    <header className="space-y-6 border-b border-border pb-12">
     <h1 className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter leading-none">
      {title} <span className="text-muted-foreground">{titleAccent}</span>
     </h1>
     <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-display text-muted-foreground">
      <CalendarClock className="w-4 h-4 text-primary shrink-0" aria-hidden />
      <span>آخرین به‌روزرسانی:</span>
      <span className="font-bold text-foreground">{lastUpdated}</span>
     </div>
    </header>

    <div className="space-y-12 font-sans text-foreground/80 leading-loose text-lg text-right">
     {children}
    </div>

    {contactEmail && (
     <div className="rounded-[2rem] border border-border bg-card/40 p-8 md:p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
       <Mail className="h-5 w-5" aria-hidden />
      </div>
      {contactLabel && (
       <p className="text-sm text-muted-foreground font-display">{contactLabel}</p>
      )}
      <a
       href={`mailto:${contactEmail}`}
       dir="ltr"
       className="mt-2 inline-block font-mono text-base text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors"
      >
       {contactEmail}
      </a>
     </div>
    )}
   </div>

   <Footer />
  </main>
 );
}
