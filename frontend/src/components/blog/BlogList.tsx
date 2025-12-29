'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/effects/SpotlightCard';
import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/blog';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {posts.map((post) => (
        <motion.div key={post.slug} variants={item}>
          <Link href={`/blog/${post.slug}`}>
            <SpotlightCard className="h-full flex flex-col p-6 bg-zinc-900/40 border-white/10 group hover:border-primary/50 transition-colors">
              <div className="mb-4">
                <div className="flex gap-2 flex-wrap mb-4">
                  {post.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                          #{tag}
                      </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold font-display mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                 <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingTime}</span>
                 </div>
                 <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:-translate-x-1 transition-transform" />
              </div>
            </SpotlightCard>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
