'use client';

import React, { useState, useEffect } from 'react';
import ServicesList, { Service } from './ServicesList';

const STATIC_SERVICES: Service[] = [
  { id: 1, title: 'تحلیل و مشاوره', description: 'بررسی دقیق نیازها و تدوین نقشه راه تکنولوژی برای پروژه‌های مقیاس‌پذیر.', iconName: 'SearchCode', order: 1 },
  { id: 2, title: 'مهندسی معماری', description: 'طراحی زیرساخت‌های توزیع‌شده با تمرکز بر پایداری حداکثری و ترافیک بالا.', iconName: 'Share2', order: 2 },
  { id: 3, title: 'توسعه محصول', description: 'پیاده‌سازی کدهای بهینه با بالاترین استانداردهای مهندسی نرم‌افزار.', iconName: 'Code2', order: 3 },
  { id: 4, title: 'امنیت سایبری', description: 'تست نفوذ و ایمن‌سازی زیرساخت‌های حیاتی در برابر تهدیدات پیشرفته.', iconName: 'ShieldCheck', order: 4 },
  { id: 5, title: 'زیرساخت ابری', description: 'مدیریت و خودکارسازی سرویس‌ها با استفاده از تکنولوژی‌های Docker و Kubernetes.', iconName: 'Cloud', order: 5 },
  { id: 6, title: 'هوش مصنوعی', description: 'توسعه و ادغام مدل‌های یادگیری ماشین برای هوشمندسازی فرآیندهای کسب‌وکار.', iconName: 'BrainCircuit', order: 6 },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(STATIC_SERVICES);

  useEffect(() => {
    async function fetchServices() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const res = await fetch(`${apiUrl}/api/v1/services`);
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (error) {
        // Fallback is already set
      }
    }
    fetchServices();
  }, []);

  return <ServicesList services={services} />;
}