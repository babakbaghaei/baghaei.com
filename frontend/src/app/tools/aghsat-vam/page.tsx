import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'محاسبه‌گر اقساط وام',
  description:
    'محاسبهٔ قسط ماهانه، سود کل و جدول بازپرداخت وام بانکی بر پایهٔ فرمول اقساط مساوی.',
  alternates: { canonical: '/tools/aghsat-vam' },
};

export default function Page() {
  return <Client />;
}
