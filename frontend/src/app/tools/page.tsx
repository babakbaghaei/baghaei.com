import type { Metadata } from 'next';
import ToolsClient from './ToolsClient';

export const metadata: Metadata = {
  title: 'جعبه ابزار',
  description:
    'مجموعه ابزارهای رایگان آنلاین: ماشین‌حساب‌های حقوقی، مالی، ملکی و کمکی. همه محاسبات در مرورگر شما.',
  alternates: { canonical: '/tools' },
  openGraph: {
    type: 'website',
    title: 'جعبه ابزار | گروه فناوری بقایی',
    description:
      'مجموعه ابزارهای رایگان آنلاین: ماشین‌حساب‌های حقوقی، مالی، ملکی و کمکی. همه محاسبات در مرورگر شما.',
    url: '/tools',
  },
};

export default function Page() {
  return <ToolsClient />;
}
