import React from 'react';
import ServicesList, { Service } from './ServicesList';

async function getServices(): Promise<Service[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${apiUrl}/api/v1/services`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch services');
    }

    return res.json();
  } catch (error) {
    console.error('Error loading services:', error);
    // Fallback static data if API fails (High Availability)
    return [
      { id: 1, title: 'تحلیل و مشاوره', description: 'بررسی دقیق نیازها و تدوین نقشه راه تکنولوژی برای پروژه‌های مقیاس‌پذیر.', iconName: 'SearchCode', order: 1 },
      { id: 2, title: 'مهندسی معماری', description: 'طراحی زیرساخت‌های توزیع‌شده با تمرکز بر پایداری حداکثری و ترافیک بالا.', iconName: 'Share2', order: 2 },
      { id: 3, title: 'توسعه محصول', description: 'پیاده‌سازی کدهای بهینه با بالاترین استانداردهای مهندسی نرم‌افزار.', iconName: 'Code2', order: 3 },
    ];
  }
}

export default async function Services() {
  const services = await getServices();
  return <ServicesList services={services} />;
}
