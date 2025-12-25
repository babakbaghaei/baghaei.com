'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: 'black', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>خطای کلاینت رخ داد</h2>
      <p>متن خطا: <span style={{ color: 'red' }}>{error.message}</span></p>
      <p>کد دیجیت: {error.digest}</p>
      <button onClick={() => reset()}>تلاش دوباره</button>
      <hr />
      <p>نکته: اگر این صفحه را می‌بینید، احتمالاً کش مرورگر شما قدیمی است.</p>
    </div>
  );
}