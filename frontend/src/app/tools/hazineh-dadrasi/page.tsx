import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'هزینهٔ دادرسی و تمبر دادخواست',
  description:
    'برآورد هزینهٔ دادرسی دعاوی مالی بر اساس بهای خواسته و مرحلهٔ رسیدگی.',
  alternates: { canonical: '/tools/hazineh-dadrasi' },
};

export default function Page() {
  return <Client />;
}
