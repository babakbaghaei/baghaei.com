import React from 'react';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackgroundGrid from '@/components/ui/effects/BackgroundGrid';
import { Calendar, User, ArrowRight, Tag, BrainCircuit, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | وبلاگ گروه فناوری بقایی`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <BackgroundGrid />
      <Navbar />
      <ReadingProgressBar />
      
      <article className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full z-10 flex-grow">
        <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-sm font-display">
            <ArrowRight className="w-4 h-4" /> بازگشت به وبلاگ
        </Link>

        <header className="mb-12 border-b border-white/10 pb-12">
            <div className="flex gap-2 mb-6">
                {post.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                        <Tag className="w-3 h-3" /> {tag}
                    </span>
                ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display mb-8 leading-tight text-white">
                {post.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-zinc-400 font-mono">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> {post.author}</span>
            </div>
        </header>

        {/* AI Intelligence Summary */}
        <div className="mb-16 p-8 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-primary font-mono">AI-Generated Insights</span>
            </div>
            <h3 className="text-xl font-bold mb-4 font-display">خلاصه هوشمند مقاله</h3>
            <p className="text-zinc-400 leading-relaxed font-display">
                این مقاله به بررسی استراتژیک معماری‌های نوین و تاثیر آن‌ها بر مقیاس‌پذیری سیستم‌های سازمانی می‌پردازد. 
                تمرکز اصلی بر کاهش پیچیدگی‌های فنی و افزایش بهره‌وری در محیط‌های Cloud-Native است.
            </p>
            <div className="mt-6 flex gap-4">
                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-500 font-mono">
                    ENGINE: BAGHAEI-GPT-4
                </div>
                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary" /> CONFIDENCE: 99.8%
                </div>
            </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-p:text-zinc-300 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-white">
            {post.content}
        </div>
      </article>

      <Footer />
    </main>
  );
}
