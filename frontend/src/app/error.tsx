'use client';

import React from 'react';
import ErrorLayout from '@/components/layout/ErrorLayout';
import { Button } from '@/components/ui/Button';
import { useErrorLogger } from '@/lib/hooks/useErrorLogger';

export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useErrorLogger(error);

 return (
  <div className="relative">
   <ErrorLayout 
    code="۵۰۰"
    title="خطای غیرمنتظره"
    description="مشکلی در پردازش درخواست شما پیش آمده است. تیم فنی ما از این موضوع آگاه شده است."
   />
   <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
    <Button onClick={() => reset()} variant="outline">
     تلاش دوباره
    </Button>
   </div>
  </div>
 );
}