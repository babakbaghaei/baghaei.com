import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'فرمت و اعتبارسنجی JSON',
  description:
    'مرتب‌سازی، فشرده‌سازی و بررسی صحت JSON با نمایش خطای دقیق.',
  alternates: { canonical: '/tools/json-formatter' },
};

export default function Page() {
  return <Client />;
}
