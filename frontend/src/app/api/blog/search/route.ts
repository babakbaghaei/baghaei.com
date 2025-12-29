import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';

export async function GET() {
  try {
    const posts = await getAllPosts();
    // Return only necessary fields for search to keep payload small
    const searchData = posts.map(post => ({
      title: post.title,
      slug: post.slug,
      tags: post.tags
    }));
    return NextResponse.json(searchData);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
