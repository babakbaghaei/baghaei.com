import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'محاسبه‌گر اقساط لیزینگ',
  description:
    'محاسبهٔ قسط ماهانه و سود کل خرید اقساطی/لیزینگ بر پایهٔ مبلغ، پیش‌پرداخت و نرخ سود.',
  alternates: { canonical: '/tools/leasing-khodro' },
};

export default function Page() {
  return <Client />;
}
