import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'سنگ کاغذ قیچی',
  description: 'بازی سنگ، کاغذ، قیچی در برابر رایانه؛ با امتیازشماری و نتیجهٔ آنی.',
  alternates: { canonical: '/tools/sang-kaghaz-gheychi' },
};

export default function Page() {
  return <Client />;
}
