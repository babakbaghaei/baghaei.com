import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
      <Loader2 className="w-7 h-7 animate-spin text-primary" />
      <p className="font-display text-sm">در حال بارگذاری...</p>
    </div>
  );
}
