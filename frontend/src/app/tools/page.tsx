import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { PenTool, Keyboard, Dices } from 'lucide-react';

const tools = [
  { 
    id: 'cheque-nevis', 
    title: 'چک نویس آنلاین', 
    desc: 'تبدیل مبلغ ریالی به حروف برای نوشتن چک صیادی بدون خطا.',
    icon: PenTool,
    color: 'text-blue-500'
  },
  { 
    id: 'type-jangi', 
    title: 'تایپ جنگی', 
    desc: 'مسابقه سرعت تایپ و سنجش مهارت‌های انگشتان شما.',
    icon: Keyboard,
    color: 'text-orange-500'
  },
  { 
    id: 'spin-win', 
    title: 'گردونه شانس', 
    desc: 'یک ابزار ساده برای قرعه‌کشی و انتخاب تصادفی.',
    icon: Dices,
    color: 'text-purple-500'
  },
];

export default function ToolsIndex() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-display mb-2">ابزارهای کاربردی</h1>
        <p className="text-muted-foreground">مجموعه‌ای از ابزارهای کوچک اما قدرتمند برای کارهای روزمره.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.id} href={`/tools/${tool.id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer">
              <div className={`w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4 ${tool.color} bg-opacity-10`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tool.desc}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
