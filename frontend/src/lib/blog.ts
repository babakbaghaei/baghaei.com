import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import readingTime from 'reading-time';
import CodeBlock from '@/components/blog/CodeBlock';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  tags: string[];
  readingTime: string;
  content: React.ReactNode; // MDX content
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { content, data } = matter(fileContents);
    
    // Calculate reading time
    const stats = readingTime(content);
    const faReadingTime = Math.ceil(stats.minutes) + ' دقیقه مطالعه';

    // Compile MDX directly
    const { content: mdxContent } = await compileMDX({
        source: content,
        options: { parseFrontmatter: true },
        components: {
            pre: CodeBlock,
        }
    });

    return {
      slug: realSlug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      author: data.author,
      tags: data.tags || [],
      readingTime: faReadingTime,
      content: mdxContent,
    } as BlogPost;
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  let files: string[];
  try {
    files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.mdx'));
  } catch {
    // content/posts may not exist yet — degrade gracefully instead of crashing.
    return [];
  }

  const posts = await Promise.all(
    files.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      return await getPostBySlug(slug);
    })
  );

  // Filter out nulls and sort by date desc
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Lightweight metadata (no MDX compilation) — for RSS, related posts, listings.
export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  tags: string[];
  readingTime: string;
}

export function getAllPostsMeta(): BlogPostMeta[] {
  let files: string[];
  try {
    files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.mdx'));
  } catch {
    return [];
  }

  return files
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, `${slug}.mdx`);
      const { content, data } = matter(fs.readFileSync(fullPath, 'utf8'));
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        excerpt: data.excerpt ?? '',
        coverImage: data.coverImage,
        author: data.author ?? 'گروه فناوری بقایی',
        tags: data.tags ?? [],
        readingTime: Math.ceil(readingTime(content).minutes) + ' دقیقه مطالعه',
      } as BlogPostMeta;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Posts sharing the most tags with the current one (excluding itself).
export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): BlogPostMeta[] {
  const tagSet = new Set(tags);
  return getAllPostsMeta()
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({ post: p, score: p.tags.filter((t) => tagSet.has(t)).length }))
    .sort((a, b) => b.score - a.score || (a.post.date > b.post.date ? -1 : 1))
    .slice(0, limit)
    .map((x) => x.post);
}
