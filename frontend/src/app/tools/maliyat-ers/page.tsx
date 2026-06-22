import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مالیات بر ارث',
  description:
    'محاسبهٔ مالیات بر ارث بر حسب نوع دارایی و طبقهٔ وراث، طبق مادهٔ ۱۷ قانون مالیات‌های مستقیم.',
  alternates: { canonical: '/tools/maliyat-ers' },
};

export default function Page() {
  return <Client />;
}
