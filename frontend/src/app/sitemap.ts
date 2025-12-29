import { MetadataRoute } from 'next';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const baseUrl = 'https://baghaei.com';
 const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

 // Static routes
 const routes = [
  '',
  '/projects',
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

 // Tools (Static for now, could be dynamic)
 const tools = [
  'cheque-nevis',
  'type-jangi',
  'spin-win',
 ].map((tool) => ({
  url: `https://tools.baghaei.com/${tool}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.9,
 }));

 // Dynamic Projects
 let projects = [];
 try {
  const res = await fetch(`${apiUrl}/api/v1/projects`, { next: { revalidate: 3600 } });
  if (res.ok) {
   const data = await res.json();
   projects = data.map((project: any) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
   }));
  }
 } catch (error) {
  console.error('Failed to fetch projects for sitemap:', error);
 }

 return [...routes, ...tools, ...projects];
}
