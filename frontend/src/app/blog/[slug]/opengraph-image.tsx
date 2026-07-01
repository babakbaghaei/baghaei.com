import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPostBySlug, getAllPosts } from '@/lib/blog';

// Per-post branded Open Graph card generated at request time (node runtime).
// Mirrors the root src/app/opengraph-image.tsx (gradient bg, embedded YekanBakh
// font, accent line) but shows the post TITLE so social previews are specific.
export const runtime = 'nodejs';
export const alt = 'وبلاگ گروه فناوری بقائی';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

const yekanBold = readFileSync(
  join(process.cwd(), 'public/fonts/YekanBakh/YekanBakh-Bold.ttf'),
);
const yekanRegular = readFileSync(
  join(process.cwd(), 'public/fonts/YekanBakh/YekanBakh-Regular.ttf'),
);

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const title = post?.title || 'وبلاگ گروه فناوری بقائی';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(1200px 600px at 50% -10%, #15151c 0%, #000000 60%)',
          color: '#ffffff',
          fontFamily: 'Yekan',
          direction: 'rtl',
          textAlign: 'center',
          position: 'relative',
          padding: '0 110px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 34,
          }}
        >
          وبلاگ گروه فناوری بقائی
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 48 ? 64 : 84,
            fontWeight: 700,
            letterSpacing: '-2px',
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 56,
            fontSize: 24,
            letterSpacing: '14px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 700,
          }}
        >
          BAGHAEI TECH GROUP
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Yekan', data: yekanBold, weight: 700, style: 'normal' },
        { name: 'Yekan', data: yekanRegular, weight: 400, style: 'normal' },
      ],
    },
  );
}
