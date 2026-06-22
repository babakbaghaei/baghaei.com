import React from 'react';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackgroundGrid from '@/components/ui/effects/BackgroundGrid';
import { Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import ShareButtons from '@/components/blog/ShareButtons';
import { Card } from '@/components/ui/Card';

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
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
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

  // Prefer the post's own cover image; otherwise fall back to the dynamic
  // per-post OG card (opengraph-image.tsx) so the share preview still shows
  // the post title rather than the generic site card.
  const ogImage = post.coverImage
    ? `${SITE_URL}${post.coverImage}`
    : `${SITE_URL}/blog/${post.slug}/opengraph-image`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: ogImage,
    author: {
      '@type': 'Organization',
      name: 'گروه فناوری بقایی',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'گروه فناوری بقایی',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    keywords: post.tags.join(', '),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'وبلاگ', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
            <div className="mt-8">
                <ShareButtons url={`${SITE_URL}/blog/${post.slug}`} title={post.title} />
            </div>
        </header>

        <div
            dir="rtl"
            className="prose dark:prose-invert prose-lg max-w-none text-right prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-ul:pr-6 prose-ul:pl-0 prose-ol:pr-6 prose-ol:pl-0 prose-li:marker:text-muted-foreground prose-blockquote:border-s-4 prose-blockquote:border-e-0 prose-blockquote:border-primary/40 prose-blockquote:ps-6 prose-blockquote:pe-0"
        >
            {post.content}
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <h2 className="text-2xl font-black font-display mb-8">مطالب مرتبط</h2>
            <div className={`grid grid-cols-1 gap-6 ${related.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="block h-full rounded-[1.5rem] outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <Card
                    roundedClass="rounded-[1.5rem]"
                    className="p-1.5"
                    contentClassName="p-6"
                    isHoverable
                    colorOnHoverOnly
                  >
                    <div className="flex h-full flex-col text-right" dir="rtl" style={{ transformStyle: 'preserve-3d' }}>
                      <h3 className="font-bold font-display mb-2 leading-snug text-foreground group-hover:text-primary transition-colors duration-500 line-clamp-2">
                        {rp.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{rp.excerpt}</p>
                      <span className="mt-auto text-[11px] text-muted-foreground font-mono flex items-center gap-2">
                        <Clock className="w-3 h-3" /> {rp.readingTime}
                      </span>
                    </div>
                  </Card>
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
