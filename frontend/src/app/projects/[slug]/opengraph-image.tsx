import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECTS_DATA } from '@/lib/data/projects';

// Per-project branded Open Graph card generated at request time (node runtime).
// Mirrors the root src/app/opengraph-image.tsx (gradient bg, embedded YekanBakh
// font, accent line) but shows the project TITLE so social previews are specific.
export const runtime = 'nodejs';
export const alt = 'نمونه‌کار گروه فناوری بقایی';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Only non-hidden projects get a generated card — hidden (NDA) slugs 404.
export function generateStaticParams() {
  return PROJECTS_DATA.filter((p) => p.slug && !p.hidden).map((p) => ({ slug: p.slug as string }));
}

function getProject(slug: string) {
  const project = PROJECTS_DATA.find((p) => p.slug === slug);
  if (!project || project.hidden) return undefined;
  return project;
}

const yekanBold = readFileSync(
  join(process.cwd(), 'public/fonts/YekanBakh/YekanBakh-Bold.ttf'),
);
const yekanRegular = readFileSync(
  join(process.cwd(), 'public/fonts/YekanBakh/YekanBakh-Regular.ttf'),
);

export default async function Image({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  const title = project?.title || 'نمونه‌کار گروه فناوری بقایی';
  const category = project?.category || '';
  const accent = project?.borderColor || 'rgba(255,255,255,0.6)';

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
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
        {category ? (
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 34,
            }}
          >
            {category}
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 40 ? 64 : 88,
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
