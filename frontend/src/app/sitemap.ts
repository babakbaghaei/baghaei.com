import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/data/tools';
import { PROJECTS_DATA } from '@/lib/data/projects';

export const revalidate = 3600; // Revalidate every hour

export default function sitemap(): MetadataRoute.Sitemap {
 const baseUrl = 'https://baghaei.com';

 // Static routes
 const routes = [
  '',
  '/projects',
  '/tools',
  '/blog',
  '/careers',
  '/privacy',
  '/terms',
 ].map((route) => ({
  url: `${baseUrl}${route}`,
  lastModified: new Date(),
  changeFrequency: 'monthly' as const,
  priority: route === '' ? 1 : 0.8,
 }));

 // Tools — derived from the registry so the sitemap always matches the suite.
 const tools = TOOLS.map((tool) => ({
  url: `${baseUrl}/tools/${tool.slug}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.9,
 }));

 // Project case-study pages — derived from the static project data.
 const projects = PROJECTS_DATA.filter((p) => p.slug).map((project) => ({
  url: `${baseUrl}/projects/${project.slug}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.7,
 }));

 return [...routes, ...tools, ...projects];
}
