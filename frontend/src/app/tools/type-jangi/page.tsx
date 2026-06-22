import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'سرعت‌سنج تایپ',
  description: 'سنجش سرعت و دقت تایپ فارسی با چالش‌های هیجان‌انگیز و رقابتی.',
  alternates: { canonical: '/tools/type-jangi' },
};

export default function Page() {
  return <Client />;
}
