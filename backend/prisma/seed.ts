import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seeding...');

  // Create Admin User
  await prisma.user.upsert({
    where: { email: 'admin@baghaei.com' },
    update: {},
    create: {
      email: 'admin@baghaei.com',
      password: 'admin-password-123', 
      name: 'Babak Baghaei',
      role: 'ADMIN',
    },
  });

  // Services
  const services = [
    { title: 'Web Development', description: 'Enterprise Next.js & NestJS solutions', iconName: 'Globe' },
    { title: 'Cloud Infrastructure', description: 'AWS, Docker & Kubernetes optimization', iconName: 'Cloud' },
    { title: 'Security Audit', description: 'Penetration testing & secure architecture', iconName: 'Shield' },
    { title: 'SEO Optimization', description: 'Technical SEO and content strategy', iconName: 'TrendingUp' },
    { title: 'UI/UX Design', description: 'Modern, minimal and accessible design systems', iconName: 'Palette' },
    { title: 'API Integration', description: 'High-performance microservices & middleware', iconName: 'Code' },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { title: s.title },
      update: s,
      create: s,
    });
  }

  // Projects
  const projects = [
    { 
      title: 'Global Logistics Hub', 
      slug: 'global-logistics-hub',
      description: 'A real-time tracking system for international shipments.', 
      imageUrl: '/assets/projects/logistics.jpg',
      tags: 'React, Node.js, PostgreSQL',
      published: true
    },
    { 
      title: 'Fintech Wallet', 
      slug: 'fintech-wallet',
      description: 'Secure digital wallet with multi-currency support.', 
      imageUrl: '/assets/projects/fintech.jpg',
      tags: 'Next.js, NestJS, Redis',
      published: true
    },
    { 
      title: 'E-Learning Platform', 
      slug: 'elearning-platform',
      description: 'LMS with video streaming and interactive quizzes.', 
      imageUrl: '/assets/projects/elearning.jpg',
      tags: 'TypeScript, GraphQL, Docker',
      published: true
    }
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
