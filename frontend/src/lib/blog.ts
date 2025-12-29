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
  } catch (error) {
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(postsDirectory);
  
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
