'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface CareerModalProps {
 job: any | null;
 onClose: () => void;
}

export const CareerModal: React.FC<CareerModalProps> = ({ job, onClose }) => {
 const [form, setForm] = React.useState({ name: '', email: '', phone: '', portfolioUrl: '', message: '' });
 const [status, setStatus] = React.useState<'idle' | 'sending' | 'done' | 'error'>('idle');
 const dialogRef = React.useRef<HTMLDivElement>(null);
 const restoreFocusRef = React.useRef<HTMLElement | null>(null);

 React.useEffect(() => { setForm({ name: '', email: '', phone: '', portfolioUrl: '', message: '' }); setStatus('idle'); }, [job]);

 // Dialog accessibility: while open, trap Tab focus inside the modal, close on
 // Escape, and restore focus to the trigger on close. Without this the apply
 // flow is unreachable/unusable for keyboard and screen-reader users.
 React.useEffect(() => {
  if (!job) return;
  restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;
  const node = dialogRef.current;
  const getFocusable = () =>
   node
    ? Array.from(
       node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
       )
      )
    : [];
  // Move focus into the dialog (first field) on open.
  const first = getFocusable()[0];
  first?.focus();
  const onKey = (e: KeyboardEvent) => {
   if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
   if (e.key !== 'Tab') return;
   const items = getFocusable();
   if (items.length === 0) return;
   const firstEl = items[0];
   const lastEl = items[items.length - 1];
   if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
   else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
  };
  document.addEventListener('keydown', onKey);
  return () => {
   document.removeEventListener('keydown', onKey);
   restoreFocusRef.current?.focus?.();
  };
 }, [job, onClose]);

 if (!job) return null;

 const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.name.trim() || !form.email.trim()) { setStatus('error'); return; }
  setStatus('sending');
  try {
   const { api } = await import('@/lib/api');
   const payload: Record<string, string> = {
    position: job.title,
    name: form.name,
    email: form.email,
   };
   if (form.phone.trim()) payload.phone = form.phone.trim();
   if (form.portfolioUrl.trim()) payload.portfolioUrl = form.portfolioUrl.trim();
   if (form.message.trim()) payload.message = form.message.trim();
   await api.post('/careers', payload);
   setStatus('done');
  } catch {
   setStatus('error');
  }
 };

 return (
  <AnimatePresence>
   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     onClick={onClose}
     aria-hidden="true"
     className="absolute inset-0 bg-background/95 cursor-pointer"
    />

    <motion.div
     ref={dialogRef}
     role="dialog"
     aria-modal="true"
     aria-labelledby="career-modal-title"
     initial={{ opacity: 0, y: 100 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: 100 }}
     className="bg-card w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-border relative z-10 overflow-y-auto custom-scrollbar"
    >
     <button onClick={onClose} aria-label="بستن" className="absolute top-8 left-8 text-muted-foreground hover:text-foreground transition-colors z-20">
      <X className="w-6 h-6" aria-hidden="true" />
     </button>

     <div className="p-8 md:p-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
       {/* Job Details */}
       <div className="space-y-10 text-right">
        <div className="space-y-4">
         <div className="text-xs font-black text-muted-foreground uppercase tracking-widest font-display">{job.type}</div>
         <h2 id="career-modal-title" className="text-4xl font-bold font-display text-foreground leading-tight">{job.title}</h2>
        </div>

        {job.requirements && (
         <div className="space-y-4">
          <h4 className="text-sm font-black text-foreground uppercase tracking-wider font-display">نیازمندی‌های کلیدی</h4>
          <ul className="space-y-3">
           {job.requirements.map((req: string, i: number) => (
            <li key={i} className="flex items-start gap-3 justify-end text-muted-foreground text-sm leading-relaxed">
             <span>{req}</span>
             <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" aria-hidden="true" />
            </li>
           ))}
          </ul>
         </div>
        )}

        {job.benefits && (
         <div className="space-y-4">
          <h4 className="text-sm font-black text-foreground uppercase tracking-wider font-display">مزایای همکاری</h4>
          <ul className="space-y-3">
           {job.benefits.map((benefit: string, i: number) => (
            <li key={i} className="flex items-start gap-3 justify-end text-muted-foreground text-sm leading-relaxed">
             <span>{benefit}</span>
             <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" aria-hidden="true" />
            </li>
           ))}
          </ul>
         </div>
        )}
       </div>

       {/* Application Form */}
       <div className="space-y-10 bg-foreground/5 p-8 md:p-12 rounded-[2.5rem] border border-border">
        <h3 className="text-xl font-bold font-display text-foreground text-right">ثبت درخواست همکاری</h3>
        {status === 'done' ? (
         <div className="flex flex-col items-center gap-4 py-10 text-center" role="status">
          <CheckCircle2 className="w-12 h-12 text-primary" aria-hidden="true" />
          <p className="font-display text-foreground">درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.</p>
         </div>
        ) : (
         <form className="space-y-6" onSubmit={submit}>
          <input
           type="text" name="name" required value={form.name}
           onChange={(e) => setForm({ ...form, name: e.target.value })}
           placeholder="نام و نام خانوادگی"
           aria-label="نام و نام خانوادگی"
           className="w-full bg-transparent border-b border-border py-4 min-h-11 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right"
          />
          <input
           type="email" name="email" required value={form.email}
           onChange={(e) => setForm({ ...form, email: e.target.value })}
           placeholder="آدرس ایمیل"
           aria-label="آدرس ایمیل"
           className="w-full bg-transparent border-b border-border py-4 min-h-11 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right"
          />
          <input
           type="tel" name="phone" value={form.phone}
           onChange={(e) => setForm({ ...form, phone: e.target.value })}
           placeholder="شماره تماس (اختیاری)"
           aria-label="شماره تماس (اختیاری)"
           className="w-full bg-transparent border-b border-border py-4 min-h-11 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right"
          />
          <input
           type="url" name="portfolioUrl" value={form.portfolioUrl}
           onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
           placeholder="لینک رزومه یا نمونه‌کار (Google Drive، LinkedIn، …)"
           aria-label="لینک رزومه یا نمونه‌کار"
           className="w-full bg-transparent border-b border-border py-4 min-h-11 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right"
          />
          <textarea
           name="message" value={form.message} rows={3}
           onChange={(e) => setForm({ ...form, message: e.target.value })}
           placeholder="توضیح کوتاه (اختیاری)"
           aria-label="توضیح کوتاه (اختیاری)"
           className="w-full bg-transparent border-b border-border py-4 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right resize-none"
          />
          {status === 'error' && (
           <p className="text-rose-500 text-sm font-display" role="alert">لطفاً نام و ایمیل معتبر وارد کنید و دوباره تلاش کنید.</p>
          )}
          <Button type="submit" className="w-full py-5" disabled={status === 'sending'}>
           {status === 'sending' ? 'در حال ارسال…' : 'ارسال درخواست'}
          </Button>
         </form>
        )}
       </div>
      </div>
     </div>
    </motion.div>
   </div>
  </AnimatePresence>
 );
};
