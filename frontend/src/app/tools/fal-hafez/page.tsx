import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'فال حافظ',
  description: 'تفأل به دیوان حافظ شیرازی؛ یک غزل کامل به‌همراه تفسیر و معنی فال، با نیّت قلبی.',
  alternates: { canonical: '/tools/fal-hafez' },
};

export default function Page() {
  return <Client />;
}
