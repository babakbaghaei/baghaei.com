import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مولد لورم ایپسوم فارسی',
  description:
    'تولید متن نمونهٔ فارسی (پاراگراف، جمله یا کلمه) برای طراحی و صفحه‌آرایی.',
  alternates: { canonical: '/tools/lorem-farsi' },
};

export default function Page() {
  return <Client />;
}
