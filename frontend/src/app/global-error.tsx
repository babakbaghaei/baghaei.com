'use client';

import React from 'react';
import './globals.css';
import ErrorLayout from '@/components/layout/ErrorLayout';
import { Button } from '@/components/ui/Button';
import { useErrorLogger } from '@/lib/hooks/useErrorLogger';

export default function GlobalError({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useErrorLogger(error);

 // global-error replaces the root layout, so we own <html>/<body> here.
 // Inline critical styles (dark bg + light text + centering) guarantee the
 // critical-error screen is never unstyled even if globals.css fails to load.
 return (
  <html lang="fa" dir="rtl">
   <body
    style={{
     margin: 0,
     minHeight: '100vh',
     background: '#000',
     color: '#fafafa',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
    }}
   >
    <div className="relative" style={{ width: '100%' }}>
     <ErrorLayout
      code="۵۰۰"
      title="خطای بحرانی"
      description="متأسفانه یک خطای سیستمی رخ داده است. لطفاً صفحه را رفرش کنید."
     />
     <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
      <Button onClick={() => reset()} variant="outline">
       تلاش دوباره
      </Button>
     </div>
    </div>
   </body>
  </html>
 );
}
