import React from 'react';
import { getAllPosts } from '@/lib/blog';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackgroundGrid from '@/components/ui/effects/BackgroundGrid';
import BlogList from '@/components/blog/BlogList';

export const metadata = {
  title: 'وبلاگ | گروه فناوری بقایی',
  description: 'تجربیات، تحلیل‌ها و دانش فنی ما در مسیر خلق سیستم‌های پیشرفته.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <BackgroundGrid />
      <Navbar />
      
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto w-full z-10 flex-grow">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
            وبلاگ تخصصی
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl font-display">
            تجربیات، تحلیل‌ها و دانش فنی ما در مسیر خلق سیستم‌های پیشرفته.
          </p>
        </div>

        <BlogList posts={posts} />
      </section>
      
      <Footer />
    </main>
  );
}
