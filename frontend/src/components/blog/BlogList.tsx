'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/blog';

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <Card
        roundedClass="rounded-[1.75rem]"
        className="p-2 md:p-3"
        contentClassName="p-12 md:p-16"
        isHoverable={false}
      >
        <div className="flex flex-col items-center justify-center gap-5 text-center" dir="rtl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="h-7 w-7" strokeWidth={1.6} />
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground">
            هنوز مقاله‌ای منتشر نشده
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            به‌زودی تجربیات، تحلیل‌ها و دانش فنی تیم ما اینجا منتشر می‌شود. کمی دیرتر دوباره سر بزنید.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="h-full"
        >
          <Link href={`/blog/${post.slug}`} className="block h-full rounded-[1.75rem] outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <Card
              roundedClass="rounded-[1.75rem]"
              className="p-2 md:p-3"
              contentClassName="p-6"
              isHoverable
              colorOnHoverOnly
            >
              <div className="flex h-full flex-col text-right" dir="rtl" style={{ transformStyle: 'preserve-3d' }}>
                <div className="mb-4" style={{ transform: 'translateZ(30px)' }}>
                  <div className="flex gap-2 flex-wrap mb-4 justify-end">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                            #{tag}
                        </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold font-display mb-3 text-foreground group-hover:text-primary transition-colors duration-500">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border" style={{ transform: 'translateZ(20px)' }}>
                   <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingTime}</span>
                   </div>
                   <ArrowLeft className="w-4 h-4 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:-translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
