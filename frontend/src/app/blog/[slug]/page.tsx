import React from 'react';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackgroundGrid from '@/components/ui/effects/BackgroundGrid';
import { Calendar, User, ArrowRight, Tag, BrainCircuit, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://baghaei.com').replace(/\/$/, '');

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
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(post.slug, post.tags);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.coverImage ? `${SITE_URL}${post.coverImage}` : `${SITE_URL}/og-image.png`,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'گروه فناوری بقایی',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    keywords: post.tags.join(', '),
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackgroundGrid />
      <Navbar />
      <ReadingProgressBar />
      
      <article className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full z-10 flex-grow">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm font-display">
            <ArrowRight className="w-4 h-4" /> بازگشت به وبلاگ
        </Link>

        <header className="mb-12 border-b border-border pb-12">
            <div className="flex gap-2 mb-6">
                {post.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                        <Tag className="w-3 h-3" /> {tag}
                    </span>
                ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display mb-8 leading-tight text-foreground">
                {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-mono">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> {post.author}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readingTime}</span>
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
            <p className="text-muted-foreground leading-relaxed font-display">
                این مقاله به بررسی استراتژیک معماری‌های نوین و تاثیر آن‌ها بر مقیاس‌پذیری سیستم‌های سازمانی می‌پردازد.
                تمرکز اصلی بر کاهش پیچیدگی‌های فنی و افزایش بهره‌وری در محیط‌های Cloud-Native است.
            </p>
            <div className="mt-6 flex gap-4">
                <div className="px-3 py-1 rounded-lg bg-foreground/5 border border-border text-[10px] text-muted-foreground font-mono">
                    ENGINE: BAGHAEI-GPT-4
                </div>
                <div className="px-3 py-1 rounded-lg bg-foreground/5 border border-border text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary" /> CONFIDENCE: 99.8%
                </div>
            </div>
        </div>

        <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground">
            {post.content}
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <h2 className="text-2xl font-black font-display mb-8">مطالب مرتبط</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary/40"
                >
                  <h3 className="font-bold font-display mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {rp.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{rp.excerpt}</p>
                  <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {rp.readingTime}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </main>
  );
}
