import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'راه‌کارها و قیمت‌گذاری',
  description:
    'بسته‌های طراحی و توسعهٔ نرم‌افزار با قیمت‌گذاری شفاف: وب‌سایت و لندینگ، وب‌اپلیکیشن و داشبورد، و بک‌اند و زیرساخت. یک مهندس ارشد با ۱۱ سال تجربه، مستقیم و بدون واسطه.',
  keywords: [
    'قیمت طراحی سایت',
    'قیمت طراحی وب اپلیکیشن',
    'هزینه توسعه نرم‌افزار',
    'بسته‌های طراحی سایت',
    'قیمت بک‌اند و API',
    'مشاوره معماری نرم‌افزار',
    'فریلنسر ارشد نرم‌افزار',
    'بابک بقائی',
    'گروه فناوری بقائی',
  ],
  alternates: { canonical: '/pricing' },
  openGraph: {
    type: 'website',
    title: 'راه‌کارها و قیمت‌گذاری | گروه فناوری بقائی',
    description:
      'بسته‌ها و محدودهٔ قیمت شفاف برای طراحی و توسعهٔ نرم‌افزار؛ یک مهندس ارشد، مستقیم و بدون واسطه.',
    url: '/pricing',
  },
};

export default function Page() {
  return (
    <>
      <Navbar />
      <PricingClient />
      <Footer />
    </>
  );
}
