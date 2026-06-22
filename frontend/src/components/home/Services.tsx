'use client';

import React, { useState, useEffect } from 'react';
import ServicesList, { Service } from './ServicesList';
import { getServices } from '@/app/actions';

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
    // Fetch via the server action: the request runs on the server (not the
    // browser), so it is not blocked by CSP and reaches the backend over its
    // real address. The action itself falls back to its own static list on error.
    let active = true;
    getServices()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) setServices(data);
      })
      .catch(() => {
        // Static fallback is already set.
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div id="services" className="scroll-mt-28">
      <ServicesList services={services} />
    </div>
  );
}