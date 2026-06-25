import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مبدل Base64',
  description:
    'رمزگذاری و رمزگشایی متن به/از Base64 با پشتیبانی کامل از یونیکد (فارسی).',
  alternates: { canonical: '/tools/base64' },
};

export default function Page() {
  return <Client />;
}
