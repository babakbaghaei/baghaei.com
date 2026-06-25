import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مهریه به نرخ روز',
  description:
    'محاسبهٔ ارزش روز مهریه بر اساس تعداد سکه و قیمت روز، یا مبلغ وجه نقد تعدیل‌شده با شاخص.',
  alternates: { canonical: '/tools/mahriyeh' },
};

export default function Page() {
  return <Client />;
}
