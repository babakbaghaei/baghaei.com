'use client';

import React from 'react';
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

 return (
  <html lang="fa" dir="rtl">
   <body>
    <div className="relative">
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
