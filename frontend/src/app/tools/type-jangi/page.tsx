'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, RotateCcw, StopCircle, BarChart3, Trophy, HelpCircle } from 'lucide-react';
import { toPersianDigits } from '@/lib/utils/format';

// Categorized Dialogues
const DIALOGUES_DATA = {
  movies: [
    { text: "بهت قول میدم، ته این بازی هیچکی برنده نیست.", source: "متری شیش و نیم" },
    { text: "من از اونا نیستم که نسیه بگیرم، نقد حساب می‌کنم.", source: "گوزن‌ها" },
    { text: "دنیای من جای قشنگی نیست، ولی من دوسش دارم.", source: "شنای پروانه" },
    { text: "ما تو این شهر غریبیم، ولی غریبه‌کش نیستیم.", source: "قیصر" },
    { text: "حقیقت همیشه تلخه، مثل ته خیار.", source: "اجاره‌نشین‌ها" }
  ],
  literature: [
    { text: "درد من حصار برکه نیست، درد من زیستن با ماهیانی است که فکر دریا به ذهنشان خطور نکرده است.", source: "صمد بهرنگی" },
    { text: "آنچه که هستی، هدیه خداوند به توست و آنچه که می‌شوی، هدیه تو به خداوند.", source: "غزالی" },
    { text: "زندگی صحنه یکتای هنرمندی ماست، هر کسی نغمه خود خواند و از صحنه رود.", source: "ژاله اصفهانی" }
  ],
  tech: [
    { text: "کدی که کار می‌کنه ولی کسی نمی‌فهمه چطوری، بمب ساعتیه.", source: "توییتر فارسی" },
    { text: "برنامه‌نویسی یعنی حل کردن مشکلاتی که خودت به وجود آوردی.", source: "تپسی" },
    { text: "دیباگ کردن مثل اینه که کارآگاه جنایی باشی و بفهمی قاتل خودت بودی.", source: "دیجی‌کالا" }
  ],
  history: [
    { text: "فرمان دادم تا بدنم را بدون تابوت و مومیایی به خاک بسپارند تا اجزای بدنم ذرات خاک ایران شود.", source: "کوروش بزرگ" },
    { text: "اگر می‌خواهید بر دشمن پیروز شوید، ابتدا بر نفس خود غلبه کنید.", source: "نادرشاه افشار" },
    { text: "من و تو از دو قبیله جدا هستیم، اما هر دو برای یک خاک می‌جنگیم.", source: "ستارخان" }
  ],
  proverbs: [
    { text: "قطره قطره جمع گردد، وانگهی دریا شود.", source: "ضرب‌المثل قدیمی" },
    { text: "جوجه را آخر پاییز می‌شمارند.", source: "فولکلور ایرانی" },
    { text: "با یک گل بهار نمی‌شود.", source: "ضرب‌المثل پارسی" }
  ]
};

const ALL_DIALOGUES = [
  ...DIALOGUES_DATA.movies, 
  ...DIALOGUES_DATA.literature, 
  ...DIALOGUES_DATA.tech, 
  ...DIALOGUES_DATA.history, 
  ...DIALOGUES_DATA.proverbs
];

const NON_CONNECTORS = new Set(['ا', 'آ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'و', ' ', '،', '.', '!', '؟']);
const DELIMITERS = new Set([' ', '،', '.', '!', '؟', '؛', ':']);
const AUTO_INSERT_SET = new Set(['\u200C', '،', '.', '!', '؟', '؛', ':', '(', ')', '-', '_']);

const HUD = memo(({ wpm, accuracy }: { wpm: number, accuracy: number }) => (
  <div className="flex justify-between items-end mb-16 px-4" dir="rtl">
    <div className="flex flex-col gap-2 text-right">
      <h1 className="text-4xl font-black font-display text-foreground text-right">تایپِ جنگی</h1>
      <div className="text-[10px] font-bold text-muted-foreground uppercase text-right">تست سرعت و دقت تایپ فارسی</div>
    </div>
    <div className="flex gap-10">
      <div className="text-right border-r border-border pr-6">
        <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">سرعت (WPM)</div>
        <div className="text-3xl font-black font-display text-indigo-600 dark:text-indigo-400">{toPersianDigits(wpm)}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">دقت</div>
        <div className="text-3xl font-black font-display text-indigo-600 dark:text-indigo-400">{toPersianDigits(accuracy)}٪</div>
      </div>
    </div>
  </div>
));
HUD.displayName = 'HUD';

export default function TypeJangi() {
  const [settings, setSettings] = useState({
    category: 'all' as (keyof typeof DIALOGUES_DATA | 'all'),
    opacity: 0.4,
    fontSize: 40,
    fontWeight: 'bold' as 'bold' | 'normal',
    funMode: false 
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [correctKeys, setCorrectKeys] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isEnglishKeyboard, setIsEnglishKeyboard] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const currentDialogue = useMemo(() => {
    const list = settings.category === 'all' ? ALL_DIALOGUES : DIALOGUES_DATA[settings.category];
    return list[currentIdx % list.length];
  }, [currentIdx, settings.category]);

  useEffect(() => {
    const handleEvents = (e: any) => {
      if (e.type === 'click' && !isGameOver && !isRoundOver) {
        inputRef.current?.focus();
      }
      if (e.type === 'keydown' && !startTime && e.key.length === 1) {
        setIsEnglishKeyboard(/[a-zA-Z]/.test(e.key));
      }
    };
    window.addEventListener('click', handleEvents);
    window.addEventListener('keydown', handleEvents);
    return () => {
      window.removeEventListener('click', handleEvents);
      window.removeEventListener('keydown', handleEvents);
    };
  }, [isGameOver, isRoundOver, startTime]);

  const nextRound = useCallback(() => {
    setIsRoundOver(false);
    setInput('');
    setCurrentIdx((prev) => prev + 1);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const stopGame = useCallback(() => {
    setIsGameOver(true);
  }, []);

  const restartAll = useCallback(() => {
    setCorrectKeys(0);
    setTotalKeys(0);
    setTotalWords(0);
    setStartTime(null);
    setIsGameOver(false);
    setIsRoundOver(false);
    setInput('');
    setCurrentIdx(Math.floor(Math.random() * 10));
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typedVal = e.target.value;
    const lastChar = typedVal[typedVal.length - 1];
    
    if (isRoundOver || isGameOver || !lastChar) return;
    if (!startTime) setStartTime(Date.now());

    setTotalKeys(prev => prev + 1);
    const targetChar = currentDialogue.text[input.length];
    
    if (lastChar !== targetChar) {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 150);
      return; 
    }

    setCorrectKeys(prev => prev + 1);
    
    let nextVal = input + lastChar;

    if (settings.funMode) {
      while (nextVal.length < currentDialogue.text.length) {
        const nextChar = currentDialogue.text[nextVal.length];
        if (AUTO_INSERT_SET.has(nextChar)) {
          nextVal += nextChar;
          if (nextVal.length < currentDialogue.text.length && currentDialogue.text[nextVal.length] === ' ') {
            nextVal += ' ';
          }
        } else break;
      }
    }

    setInput(nextVal);

    if (nextVal === currentDialogue.text) {
      setTotalWords(prev => prev + currentDialogue.text.trim().split(/\s+/).length);
      if (settings.funMode) {
        setIsRoundOver(true);
        setTimeout(nextRound, 3000);
      } else nextRound();
    }
  };

  const displayInput = useMemo(() => {
    if (!input) return '';
    const lastChar = input[input.length - 1];
    const nextTargetChar = currentDialogue.text[input.length];
    if (nextTargetChar && !DELIMITERS.has(nextTargetChar) && !NON_CONNECTORS.has(lastChar)) {
      return input + '\u200D'; 
    }
    return input;
  }, [input, currentDialogue.text]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isGameOver && !isRoundOver) {
      interval = setInterval(() => {
        const seconds = (Date.now() - startTime) / 1000;
        // Logic handling if needed
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isGameOver, isRoundOver]);

  const stats = useMemo(() => {
    if (!startTime) return { wpm: 0, accuracy: 0, cpm: 0, time: 0 };
    // This calculation is purely for rendering based on snapshots, 
    // but ideally should be driven by a tick for real-time updates.
    // For now, we accept it might lag slightly or we move time to state.
    // A better approach:
    return { 
      wpm: Math.round((correctKeys / 5) / Math.max(0.01, (Date.now() - startTime) / 60000)) || 0,
      accuracy: Math.max(0, Math.round((correctKeys / (totalKeys || 1)) * 100)),
      cpm: Math.round(correctKeys / Math.max(0.01, (Date.now() - startTime) / 60000)) || 0,
      time: Math.round((Date.now() - startTime) / 1000)
    };
  }, [startTime, correctKeys, totalKeys, input]); // Added input to trigger re-calc on typing

  const advice = useMemo(() => {
    if (!isGameOver) return "";
    const { wpm, accuracy } = stats;
    if (accuracy > 95 && wpm > 60) return "شما یک تک‌تیرانداز افسانه‌ای هستید! سرعت و دقت شما خیره‌کننده است.";
    if (accuracy > 95) return "دقت شما عالیست، حالا وقت آن است که کمی روی سرعت خود کار کنید.";
    if (accuracy > 85) return "سرعت خوبی دارید، اما مواظب باشید دقت‌تان فدای سرعت نشود.";
    return "پیشنهاد می‌کنم ابتدا روی جای انگشتان‌تان تمرکز کنید؛ دقت مهم‌تر از سرعت است.";
  }, [stats, isGameOver]);

  return (
    <main className={`min-h-screen transition-colors duration-200 flex flex-col items-center justify-center p-6 font-sans select-none overflow-hidden ${isWrong ? 'bg-primary/5' : 'bg-background'}`}>
      <div className="w-full max-w-5xl relative z-10">
        
        {/* Settings Bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 bg-card/30 border border-border p-4 rounded-3xl backdrop-blur-md" dir="rtl">
          <div className="flex items-center gap-2 border-l border-border pl-6">
            <span className="text-[10px] font-black text-muted-foreground uppercase">دسته بندی:</span>
            <select value={settings.category} onChange={(e) => { setSettings({...settings, category: e.target.value as any}); restartAll(); }} className="bg-transparent text-sm font-bold text-foreground outline-none">
              <option value="all">همه</option>
              <option value="movies">سینما</option>
              <option value="literature">ادبیات</option>
              <option value="tech">تکنولوژی</option>
              <option value="history">تاریخ</option>
              <option value="proverbs">ضرب‌المثل</option>
            </select>
          </div>

          <div className="flex items-center gap-3 border-l border-border pl-6">
            <span className="text-[10px] font-black text-muted-foreground uppercase">اوپسیتی:</span>
            <input type="range" min="0.1" max="0.8" step="0.1" value={settings.opacity} onChange={(e) => setSettings({...settings, opacity: parseFloat(e.target.value)})} className="w-20 accent-primary" />
          </div>

          <div className="flex items-center gap-3 border-l border-border pl-6">
            <span className="text-[10px] font-black text-muted-foreground uppercase">سایز:</span>
            <div className="flex gap-2">
              {[32, 40, 56].map(s => (
                <button key={s} onClick={() => setSettings({...settings, fontSize: s})} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${settings.fontSize === s ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}>
                  {toPersianDigits(s === 32 ? 'S' : s === 40 ? 'M' : 'L')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-border pl-6">
            <span className="text-[10px] font-black text-muted-foreground uppercase">وزن:</span>
            <div className="flex gap-2">
              {(['normal', 'bold'] as const).map(w => (
                <button key={w} onClick={() => setSettings({...settings, fontWeight: w})} className={`px-3 h-8 rounded-lg text-xs font-bold transition-all ${settings.fontWeight === w ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}>
                  {w === 'bold' ? 'ضخیم' : 'معمولی'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pl-4">
            <div className="flex items-center gap-1.5 group/help relative">
              <span className="text-[10px] font-black text-muted-foreground uppercase">حالت تفریحی:</span>
              <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
              <div className="absolute top-full mt-2 right-0 w-56 p-3 bg-background border border-border rounded-xl text-[10px] text-muted-foreground opacity-0 group-hover/help:opacity-100 transition-all pointer-events-none z-50 shadow-2xl leading-relaxed text-right">
                در این حالت علائم نگارشی خودکار درج شده و نام منبع اثر برای استراحت کوتاه نمایش داده می‌شود.
              </div>
            </div>
            <button onClick={() => setSettings({...settings, funMode: !settings.funMode})} className={`w-12 h-6 rounded-full relative transition-colors ${settings.funMode ? 'bg-primary' : 'bg-secondary'}`}>
              <motion.div animate={{ x: settings.funMode ? -24 : -4 }} className="absolute top-1 right-0 w-4 h-4 bg-background rounded-full shadow-sm" />
            </button>
          </div>
        </div>

        <HUD wpm={stats.wpm} accuracy={stats.accuracy} />

        <div className={`relative bg-secondary/10 border rounded-[2.5rem] p-12 md:p-20 shadow-2xl backdrop-blur-sm min-h-[350px] flex items-center justify-center overflow-hidden transition-all duration-100 ${isWrong ? 'border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] bg-primary/5' : 'border-border'}`}>
          <AnimatePresence>
            {isRoundOver && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl">
                <div className="text-primary font-black text-xs uppercase mb-4">منبع متن:</div>
                <div className="text-foreground font-black text-4xl mb-6 text-center px-10 font-sans leading-tight">{currentDialogue.source}</div>
                <div className="w-12 h-1 bg-primary/20 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3 }} className="h-full bg-primary" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative font-sans text-right leading-[1.6] md:leading-[1.8] w-full" dir="rtl" style={{ fontSize: `${settings.fontSize}px`, fontWeight: settings.fontWeight }}>
            <div style={{ opacity: settings.opacity }} className="text-muted-foreground transition-opacity duration-300">{currentDialogue.text}</div>
            <div className="absolute top-0 right-0 left-0 text-foreground pointer-events-none">
              {displayInput}
              {!isRoundOver && !isGameOver && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-[3px] h-[0.8em] bg-primary align-middle mr-1" />}
            </div>
          </div>

          <input ref={inputRef} type="text" value={input} onChange={handleInput} disabled={isGameOver || isRoundOver} className="absolute inset-0 w-full h-full opacity-0 cursor-default" autoFocus />

          {!startTime && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none z-40 text-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-foreground font-black font-sans text-xl uppercase px-6">برای شروع تست، تایپ کنید</span>
                <AnimatePresence>{isEnglishKeyboard && <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm bg-indigo-500/10 px-4 py-1 rounded-full border border-indigo-500/20">هشدار: زبان کیبورد شما انگلیسی است!</motion.span>}</AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center gap-6">
          <button onClick={stopGame} className="flex items-center gap-3 px-10 py-4 rounded-full bg-secondary border border-border text-muted-foreground hover:text-primary transition-all font-bold font-display"><StopCircle className="w-5 h-5" /> توقف و مشاهده گزارش</button>
        </div>

        <AnimatePresence>
          {isGameOver && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/95 backdrop-blur-2xl">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-2xl bg-card border border-border rounded-[3rem] p-12 text-center space-y-12 shadow-2xl">
                <div className="flex justify-center"><div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40"><Trophy className="w-12 h-12 text-white" /></div></div>
                <div className="space-y-4 text-center">
                  <h2 className="text-4xl font-black font-display text-foreground uppercase">گزارش عملکرد</h2>
                  <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20"><p className="text-primary font-bold font-sans text-lg leading-relaxed">{advice}</p></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[ {l: 'سرعت خالص', v: stats.wpm, u: 'WPM', c: 'text-primary'}, {l: 'دقت کل', v: stats.accuracy, u: '%', c: 'text-primary'}, {l: 'کاراکتر/دقیقه', v: stats.cpm}, {l: 'زمان عملیات', v: stats.time, u: 'ثانیه'} ].map((s, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-secondary/50 border border-border space-y-1 text-center">
                      <div className="text-[8px] font-black text-muted-foreground uppercase">{s.l}</div>
                      <div className={`text-3xl font-black font-display ${s.c || 'text-foreground'}`}>{toPersianDigits(s.v)} <span className="text-[10px]">{s.u || ''}</span></div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4"><button onClick={restartAll} className="w-full h-16 rounded-full bg-primary text-primary-foreground font-black font-display text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20">شروع مجدد</button></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-32 text-center pb-20">
          <a href="/" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase flex items-center justify-center gap-4 group">
            <div className="w-12 h-px bg-border group-hover:w-16 transition-all" />BAGHAEI TECH<div className="w-12 h-px bg-border group-hover:w-16 transition-all" />
          </a>
        </div>
      </div>
    </main>
  );
}