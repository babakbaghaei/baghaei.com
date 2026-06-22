import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'شمارنده کلمات',
  description: 'شمارش لحظه‌ای کلمات، کاراکترها، خطوط و تخمین زمان مطالعهٔ متن فارسی.',
  alternates: { canonical: '/tools/shomaresh-kalamat' },
};

export default function Page() {
  return <Client />;
}
