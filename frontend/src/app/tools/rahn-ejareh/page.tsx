import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'تبدیل رهن و اجاره',
  description:
    'تبدیل ودیعه (رهن) به اجارهٔ ماهانه و برعکس با نرخ تبدیل دلخواه، بر پایهٔ عرف بازار مسکن.',
  alternates: { canonical: '/tools/rahn-ejareh' },
};

export default function Page() {
  return <Client />;
}
