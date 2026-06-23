'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

const labelClass = 'text-xs uppercase text-muted-foreground font-black mb-2 block px-1';
const fieldClass =
  'w-full bg-foreground/5 border border-border rounded-xl p-4 text-foreground outline-none transition-colors focus:border-foreground';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  containerClassName?: string;
}

export const AdminInput: React.FC<AdminInputProps> = ({
  label,
  id,
  className = '',
  containerClassName = '',
  ...props
}) => (
  <div className={containerClassName}>
    {label && (
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    )}
    <input id={id} className={`${fieldClass} ${className}`} {...props} />
  </div>
);

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  containerClassName?: string;
}

export const AdminTextarea: React.FC<AdminTextareaProps> = ({
  label,
  id,
  className = '',
  containerClassName = '',
  ...props
}) => (
  <div className={containerClassName}>
    {label && (
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    )}
    <textarea id={id} className={`${fieldClass} resize-none ${className}`} {...props} />
  </div>
);

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  containerClassName?: string;
}

export const AdminSelect: React.FC<AdminSelectProps> = ({
  label,
  id,
  className = '',
  containerClassName = '',
  children,
  ...props
}) => (
  <div className={containerClassName}>
    {label && (
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    )}
    <div className="relative">
      <select id={id} className={`${fieldClass} appearance-none pe-10 ${className}`} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
      />
    </div>
  </div>
);
