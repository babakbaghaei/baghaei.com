import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'ارزش طلا و آب‌شده',
  description:
    'محاسبهٔ ارزش طلا بر اساس وزن، عیار و قیمت روز هر گرم طلای خام.',
  alternates: { canonical: '/tools/arzesh-tala' },
};

export default function Page() {
  return <Client />;
}
