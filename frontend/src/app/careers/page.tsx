import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CareersClient from './CareersClient';

export const metadata: Metadata = {
 title: 'فرصت‌های شغلی',
 description: 'به تیم گروه فناوری بقائی بپیوندید؛ موقعیت‌های شغلی در توسعه نرم‌افزار، هوش مصنوعی و معماری سیستم.',
 alternates: { canonical: '/careers' },
 openGraph: {
  type: 'website',
  title: 'فرصت‌های شغلی | گروه فناوری بقائی',
  description: 'به تیم گروه فناوری بقائی بپیوندید؛ موقعیت‌های شغلی در توسعه نرم‌افزار، هوش مصنوعی و معماری سیستم.',
  url: '/careers',
 },
};

export default function CareersPage() {
 return (
  <main className="min-h-screen">
   <Navbar />
   <CareersClient />
   <Footer />
  </main>
 );
}
