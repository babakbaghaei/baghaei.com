import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'شیر یا خط',
  description: 'پرتاب سکهٔ شیر یا خط برای تصمیم‌گیری سریع و منصفانه، با انیمیشن و شمارش نتایج.',
  alternates: { canonical: '/tools/sher-ya-khat' },
};

export default function Page() {
  return <Client />;
}
