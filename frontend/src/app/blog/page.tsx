'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, Heading } from '@/components/ui/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Clock, User } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
 {
  id: 1,
  title: 'معماری میکروسرویس در مقیاس میلیونی',
  excerpt: 'چگونه توانستیم زیرساختی طراحی کنیم که بیش از ۵ میلیون درخواست روزانه را بدون وقفه هندل کند.',
  date: '۲ دی ۱۴۰۴',
  author: 'بابک بقایی',
  category: 'Architecture',
  readTime: '۱۲ دقیقه'
 },
 {
  id: 2,
  title: 'آینده هوش مصنوعی در توسعه نرم‌افزار',
  excerpt: 'بررسی تاثیر مدل‌های زبانی بزرگ بر فرآیند کدنویسی و مهندسی نرم‌افزار در سال ۲۰۲۶.',
  date: '۲۸ آذر ۱۴۰۴',
  author: 'بابک بقایی',
  category: 'AI',
  readTime: '۸ دقیقه'
 }
];

export default function BlogPage() {
 return (
  <main className="min-h-screen bg-background text-foreground">
   <Navbar />
   
   <Section className="pt-48">
    <Heading subtitle="بینش و دانش">وبلاگ</Heading>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
     {blogPosts.map((post) => (
      <Card key={post.id} className="group cursor-pointer hover:border-primary/50 transition-colors">
       <div className="space-y-6">
        <div className="flex justify-between items-center">
         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-display">
          {post.category}
         </span>
         <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-display">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
         </div>
        </div>
        
        <h3 className="text-3xl font-bold font-display leading-tight group-hover:text-primary transition-colors">
         {post.title}
        </h3>
        
        <p className="text-muted-foreground font-sans leading-relaxed text-lg line-clamp-3">
         {post.excerpt}
        </p>
        
        <div className="pt-6 flex items-center gap-4 text-xs font-black uppercase text-foreground font-display">
         <span>مطالعه مقاله</span>
         <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-[-4px]" />
        </div>
       </div>
      </Card>
     ))}
    </div>
   </Section>

   <Footer />
  </main>
 );
}
