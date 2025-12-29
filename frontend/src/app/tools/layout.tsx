import React from 'react';
import Link from 'next/link';
import { Wrench, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row max-w-5xl mx-auto w-full pt-24 px-6 gap-8">
        {/* Tools Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div className="flex items-center gap-3 text-primary mb-6">
            <Wrench className="w-6 h-6" />
            <h2 className="text-xl font-black font-display">جعبه ابزار</h2>
          </div>
          
          <nav className="space-y-2">
            <ToolLink href="/tools/cheque-nevis" title="چک نویس آنلاین" />
            <ToolLink href="/tools/type-jangi" title="تایپ جنگی" />
            <ToolLink href="/tools/spin-win" title="گردونه شانس" />
          </nav>

          <div className="bg-secondary/30 p-4 rounded-2xl text-xs text-muted-foreground leading-relaxed">
            این ابزارها برای استفاده رایگان توسعه داده شده‌اند. اگر پیشنهادی دارید، با ما تماس بگیرید.
          </div>
        </aside>

        {/* Tool Content */}
        <main className="flex-1 bg-secondary/10 rounded-3xl border border-border/50 p-6 md:p-10 min-h-[600px]">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

const ToolLink = ({ href, title }: { href: string; title: string }) => (
  <Link 
    href={href} 
    className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors group text-muted-foreground hover:text-foreground"
  >
    <span className="font-display text-sm">{title}</span>
    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
  </Link>
);
