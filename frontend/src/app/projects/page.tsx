import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

export const metadata: Metadata = {
 title: 'پروژه‌ها',
 description: 'نمونه‌کارهای گروه فناوری بقایی — پروژه‌های سازمانی در امنیت سایبری، زیرساخت ابری، هوش مصنوعی و طراحی رابط کاربری.',
 alternates: { canonical: '/projects' },
};

export default function AllProjectsPage() {
 return (
  <main className="min-h-screen bg-background">
   <Navbar />
   <ProjectsGrid />
   <Footer />
  </main>
 );
}
