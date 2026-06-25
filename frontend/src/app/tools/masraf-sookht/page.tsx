import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'محاسبهٔ مصرف سوخت خودرو',
  description:
    'محاسبهٔ مصرف سوخت (لیتر در ۱۰۰ کیلومتر) و هزینهٔ سفر بر اساس مسافت و قیمت سوخت.',
  alternates: { canonical: '/tools/masraf-sookht' },
};

export default function Page() {
  return <Client />;
}
