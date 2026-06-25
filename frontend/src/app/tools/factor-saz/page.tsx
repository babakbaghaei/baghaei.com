import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مولد فاکتور فروش',
  description:
    'ساخت فاکتور فروش با ردیف‌های کالا، جمع کل، تخفیف و مالیات بر ارزش‌افزوده، آمادهٔ چاپ.',
  alternates: { canonical: '/tools/factor-saz' },
};

export default function Page() {
  return <Client />;
}
