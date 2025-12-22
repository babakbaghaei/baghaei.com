"use client";
import React, { useEffect, useState } from 'react';

// Use a type for Project to make it cleaner
interface Project {
  id: number;
  title: string;
  year?: string;
  description: string;
  tags: string[];
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/projects`);
        if (response.ok) {
          const data = await response.json();
          // Transform backend data to match UI if needed, or use as is
          setProjects(data);
        } else {
          // Fallback to static data if backend is not reachable or empty
          console.log('Using static projects data');
          setProjects(staticProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(staticProjects);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-32">
        <div className="w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="mb-16">
            <h2 className="text-xl font-black font-display mb-3">پروژه‌های ما</h2>
            <p className="text-sm text-gray-600 font-sans max-w-2xl">نمونه کارهای موفق در مقیاس سازمانی</p>
        </div>

        <div className="relative">
            <div className="absolute right-0 top-0 bottom-4 w-32 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none z-10"></div>
            <div className="absolute left-0 top-0 bottom-4 w-32 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-10"></div>
            <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide scroll-smooth">
                {loading ? <p>Loading...</p> : projects.map((project) => (
                    <button key={project.id} type="button" className="flex-shrink-0 w-80 p-10 bg-white border-2 border-gray-200 hover:border-black hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden text-right">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="mb-6">
                                <div className="w-12 h-12 text-black transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                                   <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-black font-display group-hover:text-black transition-colors">{project.title}</h3>
                                <span className="text-xs font-black font-display text-gray-500">{project.year || '1402'}</span>
                            </div>
                            <p className="text-sm text-gray-600 font-sans leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags && project.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 text-xs font-sans border-2 border-gray-300 text-gray-700">{tag}</span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-sans text-gray-400 group-hover:text-black transition-colors">
                                <span>مشاهده جزئیات</span>
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
            </div>
        </div>
    </section>
  );
}

const staticProjects: Project[] = [
  { id: 0, title: 'پیکسل بال', year: '۱۳۹۴', description: 'بازی پیکسلی فوتبال دو نفره برای موبایل که با طراحی منحصر به فرد و صداسازی حرفه‌ای، تجربه بازی را به سطح جدیدی می‌برد. بیش از ۱۰۰ هزار دانلود و امتیاز ۴.۸ ستاره.', tags: ['طراحی', 'صداسازی', 'برنامه‌نویسی'] },
  { id: 1, title: 'مالاتا', year: '۱۳۹۶', description: 'پلتفرم فروش ماهی که با طراحی مدرن و تجربه کاربری بی‌نقص، فروش آنلاین را متحول کرد. بیش از ۵۰۰ فروشنده فعال و هزاران مشتری راضی.', tags: ['طراحی', 'برنامه‌نویسی', 'برندینگ'] },
  { id: 2, title: 'دردودل بات', year: '۱۳۹۷', description: 'پلتفرم دردودل کردن و همدلی که با هوش مصنوعی پیشرفته، تجربه تعاملی منحصر به فردی را برای کاربران فراهم می‌کند. بیش از ۵۰ هزار کاربر فعال روزانه.', tags: ['طراحی', 'برنامه‌نویسی'] },
  { id: 3, title: 'پوشیو', year: '۱۳۹۸', description: 'وب‌سایت پوش نوتیفیکیشن با طراحی مینیمال و عملکرد بی‌نقص که نرخ بازگشت کاربران را تا ۴۰٪ افزایش داد. مورد اعتماد بیش از ۲۰۰ کسب‌وکار.', tags: ['طراحی'] },
  { id: 4, title: 'راورو', year: '۱۳۹۸', description: 'طراحی رابط کاربری مدرن و حرفه‌ای که با تمرکز بر تجربه کاربری، رضایت مشتریان را به بالاترین سطح رساند.', tags: ['طراحی'] },
  { id: 5, title: 'تیونینگ کیوانی', year: '۱۳۹۹', description: 'طراحی برند و هویت بصری برای تیونینگ ماشین که با استایل منحصر به فرد، برند را در بازار رقابتی متمایز کرد. افزایش ۶۰٪ در بازدید و فروش.', tags: ['طراحی'] },
  { id: 6, title: 'رها EDR', year: '۱۴۰۰', description: 'طراحی رابط کاربری انواع سرویس‌های امنیتی با تمرکز بر امنیت و قابلیت اطمینان. مورد استفاده بیش از ۱۰۰ سازمان بزرگ و کاهش ۹۵٪ در حملات سایبری.', tags: ['طراحی'] },
  { id: 7, title: 'فرودگاه کیش', year: '۱۴۰۰', description: 'طراحی سیستم‌های FIDS و کانتر برای فرودگاه بین‌المللی کیش که با دقت و حرفه‌ای‌گری، تجربه مسافران را بهبود بخشید. کاهش ۳۰٪ در زمان انتظار و افزایش رضایت مسافران.', tags: ['طراحی'] },
  { id: 8, title: 'باشگاه رویال اقدسیه', year: '۱۴۰۱', description: 'طراحی برند و هویت بصری برای باشگاه ورزشی لوکس که با استایل مدرن و حرفه‌ای، باشگاه را به مقصدی برتر برای علاقه‌مندان به ورزش تبدیل کرد. افزایش ۴۵٪ در عضویت.', tags: ['طراحی'] },
  { id: 9, title: 'کولک', year: '۱۴۰۱', description: 'طراحی پلتفرم فروش لوازم دست‌ساز که با تمرکز بر نمایش زیبایی محصولات، فروش را تا ۷۰٪ افزایش داد. بیش از ۳۰۰ هنرمند فعال و هزاران محصول منحصر به فرد.', tags: ['طراحی'] },
  { id: 10, title: 'درسو', year: '۱۴۰۱', description: 'پلتفرم آموزش آنلاین با طراحی مدرن و تجربه کاربری بی‌نقص که یادگیری را آسان و لذت‌بخش می‌کند. بیش از ۵۰ هزار دانشجو فعال و ۲۰۰+ دوره آموزشی.', tags: ['طراحی'] },
  { id: 11, title: 'راورو', year: '۱۴۰۲', description: 'پلتفرم باگ بانتی که با طراحی مدرن و تجربه کاربری بی‌نقص، امنیت سایبری را به سطح جدیدی می‌برد. بیش از ۵۰ شرکت بزرگ و بیش از ۱۰۰۰ باگ امنیتی کشف شده.', tags: ['طراحی', 'برنامه‌نویسی'] },
];
