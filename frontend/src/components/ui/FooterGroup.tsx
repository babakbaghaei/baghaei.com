'use client';

import React from 'react';
import Link from 'next/link';

interface LinkItem {
 label: string;
 href: string;
}

interface FooterGroupProps {
 title: string;
 links: LinkItem[];
 align?: 'right' | 'left';
 // When false, items are rendered as plain informational text (no links).
 interactive?: boolean;
}

export const FooterGroup: React.FC<FooterGroupProps> = ({
 title,
 links,
 align = 'right',
 interactive = true
}) => {
 const alignClasses = align === 'right' ? 'text-right' : 'text-left';

 return (
  <div className={`space-y-10 ${alignClasses}`}>
   <h3 className="text-[10px] font-black text-muted-foreground uppercase">
    {title}
   </h3>
   <div className="flex flex-col gap-6 text-xl font-bold font-display text-foreground">
    {links.map((link) => (
     interactive ? (
      // Internal routes use next/link for client navigation (no full reload,
      // keeps PageTransition intact). Hash targets (e.g. /#services) resolve
      // to the home section.
      <Link key={link.label} href={link.href} className="hover:text-muted-foreground transition-all">
       {link.label}
      </Link>
     ) : (
      <span key={link.label} className="text-muted-foreground/90 cursor-default">
       {link.label}
      </span>
     )
    ))}
   </div>
  </div>
 );
};

