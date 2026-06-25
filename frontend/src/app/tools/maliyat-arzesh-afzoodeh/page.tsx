import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مالیات بر ارزش‌افزوده',
  description:
    'افزودن یا تفکیک مالیات بر ارزش‌افزوده از مبلغ، با نرخ قابل تنظیم.',
  alternates: { canonical: '/tools/maliyat-arzesh-afzoodeh' },
};

export default function Page() {
  return <Client />;
}
