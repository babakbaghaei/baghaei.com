'use server'

import { revalidatePath } from 'next/cache'

export interface ServiceDTO {
 id: number
 title: string
 description: string
 iconName: string
 order: number
}

// Static fallback — kept in sync with the seed/marketing list so the section
// always renders even when the backend is unreachable.
const STATIC_SERVICES: ServiceDTO[] = [
 { id: 1, title: 'تحلیل و مشاوره', description: 'بررسی دقیق نیازها و تدوین نقشه راه تکنولوژی برای پروژه‌های مقیاس‌پذیر.', iconName: 'SearchCode', order: 1 },
 { id: 2, title: 'مهندسی معماری', description: 'طراحی زیرساخت‌های توزیع‌شده با تمرکز بر پایداری حداکثری و ترافیک بالا.', iconName: 'Share2', order: 2 },
 { id: 3, title: 'توسعه محصول', description: 'پیاده‌سازی کدهای بهینه با بالاترین استانداردهای مهندسی نرم‌افزار.', iconName: 'Code2', order: 3 },
 { id: 4, title: 'امنیت سایبری', description: 'تست نفوذ و ایمن‌سازی زیرساخت‌های حیاتی در برابر تهدیدات پیشرفته.', iconName: 'ShieldCheck', order: 4 },
 { id: 5, title: 'زیرساخت ابری', description: 'مدیریت و خودکارسازی سرویس‌ها با استفاده از تکنولوژی‌های Docker و Kubernetes.', iconName: 'Cloud', order: 5 },
 { id: 6, title: 'هوش مصنوعی', description: 'توسعه و ادغام مدل‌های یادگیری ماشین برای هوشمندسازی فرآیندهای کسب‌وکار.', iconName: 'BrainCircuit', order: 6 },
]

/**
 * Fetch services server-side. Runs on the server (not the browser), so it is not
 * blocked by CSP and reaches the backend over its real address. Cached for an
 * hour. Falls back to the static list on any error so the section never breaks.
 */
export async function getServices(): Promise<ServiceDTO[]> {
 const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
 try {
  const res = await fetch(`${backendUrl}/api/v1/services`, {
   next: { revalidate: 3600 },
  })
  if (!res.ok) return STATIC_SERVICES
  const data = await res.json()
  return Array.isArray(data) && data.length > 0 ? data : STATIC_SERVICES
 } catch {
  return STATIC_SERVICES
 }
}

export async function submitContactForm(formData: FormData) {
 const name = formData.get('name')
 const email = formData.get('email') // This might be null if only phone is provided
 const phone = formData.get('phone')
 const message = formData.get('message')
 const company = formData.get('company') // Honeypot — real users never fill this

 // Use the internal server URL for backend communication
 const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
 console.log('Submitting to:', `${backendUrl}/api/v1/contact`);

 try {
  const response = await fetch(`${backendUrl}/api/v1/contact`, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
    name,
    email: email || undefined,
    phone,
    message,
    company: company || undefined,
   }),
  });

  if (!response.ok) {
   const errorText = await response.text();
   console.error('Backend error response:', errorText);
   throw new Error(`Server error: ${response.status}`);
  }

  revalidatePath('/');
  return { success: true };
 } catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
  console.error('Form submission action error:', error);
  return { success: false, error: errorMessage };
 }
}