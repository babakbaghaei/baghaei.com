import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مبدل واحدها',
  description: 'تبدیل سریع واحدهای طول، وزن، مساحت و دما با ضرایب استاندارد.',
  alternates: { canonical: '/tools/tabdil-vahed' },
};

export default function Page() {
  return <Client />;
}
