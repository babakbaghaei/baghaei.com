import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'چرخونه تصمیم',
  description: 'ابزاری مدرن برای قرعه‌کشی، انتخاب تصادفی و حل تردیدهای روزمره.',
  alternates: { canonical: '/tools/spin-win' },
};

export default function Page() {
  return <Client />;
}
