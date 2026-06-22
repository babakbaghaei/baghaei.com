import ErrorLayout from '@/components/layout/ErrorLayout';

export default function NotFound() {
  return (
    <ErrorLayout
      code="404"
      title="مسیر یافت نشد"
      description="صفحه‌ای که به دنبال آن هستید ممکن است حذف شده باشد یا آدرس آن تغییر کرده باشد. نگران نباشید، راه خانه همیشه باز است."
    />
  );
}
