import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, Tag, Briefcase, ExternalLink, Lock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { PROJECTS_DATA } from '@/lib/data/projects';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://baghaei.com').replace(/\/$/, '');
const DEFAULT_OG = '/og-image.png';

// Only slugs returned by generateStaticParams are rendered; any other slug 404s.
// This keeps hidden (NDA) projects unreachable by direct URL.
export const dynamicParams = false;

// Resolve a project only when it exists AND is not hidden — hidden projects must
// never render their full case-study content publicly.
function getProject(slug: string) {
  const project = PROJECTS_DATA.find((p) => p.slug === slug);
  if (!project || project.hidden) return undefined;
  return project;
}

export function generateStaticParams() {
  return PROJECTS_DATA.filter((p) => p.slug && !p.hidden).map((p) => ({ slug: p.slug as string }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return { title: 'پروژه یافت نشد' };

  // Don't expose NDA (locked) imagery in social previews — fall back to default.
  const ogSource = !project.imagesLocked && project.images?.[0] ? project.images[0] : DEFAULT_OG;
  const ogImage = ogSource.startsWith('http') ? ogSource : `${SITE_URL}${ogSource}`;

  return {
    title: `${project.title} | نمونه‌کار گروه فناوری بقایی`,
    description: project.desc,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.desc,
      url: `${SITE_URL}/projects/${project.slug}`,
      images: [{ url: ogImage, alt: project.title }],
    },
  };
}

export default async function ProjectCaseStudy(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const accent = project.borderColor;
  const related = PROJECTS_DATA.filter((p) => p.slug && !p.hidden && p.slug !== project.slug && p.category === project.category).slice(0, 3);

  // Don't surface NDA (locked) imagery in structured data either.
  const jsonLdImage = !project.imagesLocked && project.images?.[0]
    ? (project.images[0].startsWith('http') ? project.images[0] : `${SITE_URL}${project.images[0]}`)
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.desc,
    about: project.category,
    creator: { '@type': 'Organization', name: 'گروه فناوری بقایی' },
    url: `${SITE_URL}/projects/${project.slug}`,
    keywords: (project.tech || []).join(', '),
    ...(jsonLdImage ? { image: jsonLdImage } : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'پروژه‌ها', item: `${SITE_URL}/projects` },
      { '@type': 'ListItem', position: 3, name: project.title, item: `${SITE_URL}/projects/${project.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      <article className="max-w-4xl mx-auto px-6 pt-40 pb-24">
        <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-display mb-10">
          <ArrowRight className="w-4 h-4" /> بازگشت به پروژه‌ها
        </Link>

        <header className="border-b border-border pb-12 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs px-3 py-1 rounded-full font-display" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}55` }}>
              {project.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-display">
              <Briefcase className="w-3.5 h-3.5" /> {project.role}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-display leading-tight mb-6">{project.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">{project.desc}</p>
        </header>

        {/* Design / screens from the project. NDA work (imagesLocked) is rendered
            heavily blurred behind a lock overlay — never shown clearly or indexed. */}
        {project.images && project.images.length > 0 && (
          <section className="mb-16 space-y-4">
            {project.images.map((src, i) => (
              <div key={i} className="relative w-full aspect-[16/10] rounded-2xl md:rounded-[1.75rem] overflow-hidden border border-border bg-secondary/30">
                <Image
                  src={src}
                  alt={project.imagesLocked ? '' : `${project.title} — نما ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  draggable={false}
                  className={`object-cover ${project.imagesLocked ? 'blur-[26px] scale-150 select-none pointer-events-none' : ''}`}
                  priority={!project.imagesLocked && i === 0}
                />
                {project.imagesLocked && (
                  <div
                    role="img"
                    aria-label="تصاویر محرمانه"
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-background/40 backdrop-blur-2xl text-muted-foreground"
                  >
                    <Lock className="w-6 h-6" />
                    <span className="text-[11px] md:text-xs font-display font-bold">تصاویر این پروژه محرمانه است</span>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Metrics */}
        {project.metrics?.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {project.metrics.map((m, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card/40 p-5 text-center">
                <div className="text-2xl md:text-3xl font-black font-display mb-1" style={{ color: accent }}>{m.value}</div>
                <div className="text-[11px] text-muted-foreground font-display">{m.label}</div>
              </div>
            ))}
          </section>
        )}

        {/* Tech stack */}
        {project.tech && project.tech.length > 0 && (
          <section className="mb-16">
            <h2 className="text-sm font-black font-display mb-4 flex items-center gap-2 text-muted-foreground">
              <Tag className="w-4 h-4" /> پشتهٔ فناوری
            </h2>
            <div className="flex flex-wrap gap-2" dir="ltr">
              {project.tech.map((t) => (
                <span key={t} className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border bg-card/40 text-muted-foreground">{t}</span>
              ))}
            </div>
          </section>
        )}

        {project.href && (
          <a href={project.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black font-display transition-colors" style={{ background: `${accent}1a`, color: accent, border: `1px solid ${accent}55` }}>
            <ExternalLink className="w-4 h-4" /> مشاهدهٔ زنده
          </a>
        )}

        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <h2 className="text-2xl font-black font-display mb-8">پروژه‌های مشابه</h2>
            <div className={`grid grid-cols-1 gap-6 ${related.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {related.map((rp) => (
                <Link key={rp.slug} href={`/projects/${rp.slug}`} className="block h-full rounded-[1.5rem] outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                  <Card
                    roundedClass="rounded-[1.5rem]"
                    className="p-1.5"
                    contentClassName="p-6"
                    isHoverable
                    colorOnHoverOnly
                  >
                    <div className="flex h-full flex-col text-right" dir="rtl" style={{ transformStyle: 'preserve-3d' }}>
                      <h3 className="font-bold font-display mb-2 leading-snug text-foreground group-hover:text-primary transition-colors duration-500">{rp.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{rp.desc}</p>
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
