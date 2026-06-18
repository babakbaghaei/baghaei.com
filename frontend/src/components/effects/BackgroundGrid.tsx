'use client';

import React from 'react';

export default function BackgroundGrid() {
 return (
  <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
   {/* Static Grid */}
   <div
    className="absolute inset-0 opacity-[0.05]"
    style={{
     backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`,
     backgroundSize: '40px 40px'
    }}
   />
  </div>
 );
}
