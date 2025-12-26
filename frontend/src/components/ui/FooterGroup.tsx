'use client';

import React from 'react';

interface LinkItem {
 label: string;
 href: string;
}

interface FooterGroupProps {
 title: string;
 links: LinkItem[];
 align?: 'right' | 'left';
}

export const FooterGroup: React.FC<FooterGroupProps> = ({ 
 title, 
 links, 
 align = 'right' 
}) => {
 const alignClasses = align === 'right' ? 'text-right' : 'text-left';

 return (
  <div className={`space-y-10 ${alignClasses}`}>
   <h4 className="text-[10px] font-black text-muted-foreground uppercase">
    {title}
   </h4>
   <div className="flex flex-col gap-6 text-xl font-bold font-display text-foreground">
    {links.map((link) => (
     <a key={link.label} href={link.href} className="hover:text-muted-foreground transition-all">
      {link.label}
     </a>
    ))}
   </div>
  </div>
 );
};

