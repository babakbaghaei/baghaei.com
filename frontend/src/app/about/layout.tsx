import type { Metadata } from 'next';
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'درباره گروه فناوری بقایی',
  description:
    'گروه فناوری بقایی؛ تیمی از مهندسان نرم‌افزار با تمرکز بر معماری سیستم‌های مقیاس‌پذیر، امنیت سایبری، زیرساخت ابری و هوش مصنوعی.',
  alternates: { canonical: '/about' },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
