import { Project } from '@/components/ui/ProjectCard';

export const PROJECTS_DATA: Project[] = [
 { 
  id: 2, 
  title: 'پلتفرم راورو', 
  category: 'امنیت سایبری', 
  role: 'طراح ارشد رابط کاربری', 
  desc: 'توسعه پلتفرم باگ‌بانتی با هدف شناسایی شکاف‌های امنیتی توسط هکرهای کلاه سفید در مقیاس ملی.', 
  metrics: [{ label: 'باگ کشف شده', value: '۱K+' }, { label: 'شرکت فعال', value: '۵۰+' }], 
  color: 'rgba(245, 158, 11, 0.3)', 
  borderColor: 'rgba(245, 158, 11, 0.8)', 
  isLocked: false,
  tech: ['React', 'Node.js', 'PostgreSQL', 'Docker']
 },
 { 
  id: 4, 
  title: 'پیکسل بال', 
  category: 'سرگرمی و بازی', 
  role: 'طراح بازی و صداساز', 
  desc: 'طراحی و توسعه بازی موبایل پیکسلی با تمرکز بر تجربه کاربری رقابتی و صداسازی منحصر به فرد.', 
  metrics: [{ label: 'نصب فعال', value: '۱۰۰۰' }, { label: 'امتیاز کاربر', value: '۴.۷' }], 
  color: 'rgba(34, 197, 94, 0.3)', 
  borderColor: 'rgba(34, 197, 94, 0.8)', 
  isLocked: false,
  tech: ['Unity', 'C#', 'FMOD', 'Android']
 },
 { 
  id: 5, 
  title: 'پلتفرم مالاتا', 
  category: 'تجارت الکترونیک', 
  role: 'بنیان‌گذار فنی و معمار نرم‌افزار', 
  desc: 'اولین بازار آنلاین محصولات تازه دریایی با هدف حذف واسطه‌ها و اتصال مستقیم صیاد به مشتری.', 
  metrics: [{ label: 'فروشنده فعال', value: '۵۰۰+' }, { label: 'رضایت مشتری', value: '۹۵٪' }], 
  color: 'rgba(14, 165, 233, 0.3)', 
  borderColor: 'rgba(14, 165, 233, 0.8)', 
  isLocked: false,
  tech: ['Next.js', 'Go', 'Redis', 'Kubernetes']
 },
 { 
  id: 8, 
  title: 'دردودل بات', 
  category: 'هوش مصنوعی / Social', 
  role: 'بنیان‌گذار و توسعه‌دهنده', 
  desc: 'پلتفرم هوشمند گفتگو و همدلی ناشناس با محوریت هوش مصنوعی برای ایجاد ارتباطات انسانی عمیق‌تر.', 
  metrics: [{ label: 'کاربر فعال', value: '۱۰۰۰' }, { label: 'پیام روزانه', value: '۱۰۰' }], 
  color: 'rgba(168, 85, 247, 0.4)', 
  borderColor: 'rgba(168, 85, 247, 0.8)', 
  isLocked: false,
  tech: ['Python', 'PyTorch', 'FastAPI', 'MongoDB']
 },
 { 
  id: 1, 
  title: 'FIDS و Counter فرودگاه کیش', 
  category: 'زیرساخت فرودگاهی', 
  role: 'طراح ارشد رابط کاربری', 
  desc: 'طراحی سیستم‌های FIDS و رابط کاربری کانترهای فرودگاه بین‌المللی کیش با استانداردهای نوین بصری.', 
  metrics: [{ label: 'دقت نمایش', value: '۹۹.۹٪' }, { label: 'ترافیک روزانه', value: '۲۰K+' }], 
  color: 'rgba(30, 64, 175, 0.4)', 
  borderColor: 'rgba(30, 64, 175, 0.8)', 
  isLocked: true,
  tech: ['C++', 'Qt', 'WebSockets', 'Linux']
 },
 { 
  id: 3, 
  title: 'پلتفرم درسو', 
  category: 'آموزش آنلاین', 
  role: 'طراح ارشد رابط کاربری', 
  desc: 'طراحی پلتفرم مدرن آموزش از راه دور با تمرکز بر تجربه کاربری بصری و تعامل دانشجو-استاد.', 
  metrics: [{ label: 'دانشجو فعال', value: '۵۰K+' }, { label: 'دوره آموزشی', value: '۲۰۰+' }], 
  color: 'rgba(124, 58, 237, 0.4)', 
  borderColor: 'rgba(124, 58, 237, 0.8)', 
  isLocked: true,
  tech: ['React', 'GraphQL', 'AWS', 'Node.js']
 },
 { 
  id: 6, 
  title: 'پوشیو', 
  category: 'ارتباطات / SaaS', 
  role: 'طراح ارشد رابط کاربری', 
  desc: 'سرویس پوش‌نوتیفیکیشن هوشمند برای وب‌سایت‌ها و اپلیکیشن‌ها با هدف افزایش نرخ بازگشت کاربران در مقیاس میلیونی.', 
  metrics: [{ label: 'ارسال موفق', value: '۱۰M+' }, { label: 'کسب‌وکار فعال', value: '۲۰۰+' }], 
  color: 'rgba(56, 189, 248, 0.4)', 
  borderColor: 'rgba(56, 189, 248, 0.8)', 
  isLocked: true,
  tech: ['Go', 'Kafka', 'Elasticsearch', 'React']
 },
 { 
  id: 7, 
  title: 'باشگاه رویال اقدسیه', 
  category: 'هویت بصری / برندینگ', 
  role: 'طراح ارشد رابط کاربری', 
  desc: 'طراحی هویت دیجیتال و پلتفرم مدیریت مشتریان برای یکی از لوکس‌ترین مجموعه‌های ورزشی کشور.', 
  metrics: [{ label: 'افزایش عضویت', value: '۴۵٪' }, { label: 'رضایت لوکس', value: '۹۸٪' }], 
  color: 'rgba(225, 29, 72, 0.4)', 
  borderColor: 'rgba(225, 29, 72, 0.8)', 
  isLocked: true,
  tech: ['Branding', 'UI/UX', 'Next.js', 'Prisma']
 },
 { 
  id: 9, 
  title: 'تیونینگ کیوانی', 
  category: 'خودرو / لوکس', 
  role: 'معمار نرم‌افزار و طراح هویت دیجیتال', 
  desc: 'طراحی پلتفرم اختصاصی و سیستم پیکربندی خودروهای فوق‌لوکس تیونینگ شده با استانداردهای جهانی برای برند جهانی Kevany.', 
  metrics: [{ label: 'خودرو اختصاصی', value: '۱۰۰+' }, { label: 'بازدید جهانی', value: '۱M+' }], 
  color: 'rgba(115, 115, 115, 0.4)', 
  borderColor: 'rgba(212, 175, 55, 0.8)', 
  isLocked: true,
  tech: ['WebGL', 'Three.js', 'React', 'Next.js']
 }
];