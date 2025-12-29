'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Trophy, Trash2, Plus, X, Edit3, Type, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPersianDigits } from '@/lib/utils/format';

const THEME_COLORS = [
  '#6366f1', '#8b5cf6', '#3b82f6', '#0ea5e9',
  '#10b981', '#f59e0b', '#f43f5e', '#64748b'
];

const OptionChip = memo(({ 
  opt, 
  index, 
  onRemove, 
  onUpdate 
}: { 
  opt: string, 
  index: number, 
  onRemove: (i: number) => void, 
  onUpdate: (i: number, val: string) => void 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setVal] = useState(opt);

  const handleSave = () => {
    if (tempVal.trim() === '') {
      onRemove(index);
    } else {
      onUpdate(index, tempVal);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 border ${
        isEditing 
          ? 'bg-primary/5 border-primary shadow-lg ring-4 ring-primary/5' 
          : 'bg-card border-border hover:border-primary/40 shadow-sm'
      }`}
    >
      {isEditing ? (
        <input
          autoFocus
          value={tempVal}
          onChange={(e) => setVal(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="bg-transparent border-none outline-none text-foreground font-sans text-sm w-32 text-right"
        />
      ) : (
        <span 
          onClick={() => setIsEditing(true)}
          className="text-sm font-bold text-foreground cursor-text whitespace-nowrap"
        >
          {opt}
        </span>
      )}
      
      <button 
        onClick={() => onRemove(index)}
        className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
});
OptionChip.displayName = 'OptionChip';

export default function SpinWin() {
  const [options, setOptions] = useState<string[]>(['پیتزا', 'قرمه‌سبزی', 'برگر', 'کباب', 'سالاد']);
  const [inputValue, setInputValue] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || options.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = centerX - 10;
    const sliceAngle = (2 * Math.PI) / options.length;

    ctx.clearRect(0, 0, size, size);

    options.forEach((opt, i) => {
      const angle = i * sliceAngle;
      
      // Sophisticated Slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
      ctx.fillStyle = THEME_COLORS[i % THEME_COLORS.length];
      ctx.fill();
      
      // Sharp Clean Divider
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

          // Modern Typography
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle + sliceAngle / 2);
          ctx.textAlign = 'right';
          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px IRANSans';
          const displayText = opt.length > 12 ? opt.substring(0, 10) + '...' : opt;
          ctx.fillText(displayText, radius - 40, 6);
          ctx.restore();
        });
      
        // Minimal Hub
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.fill();
      }, [options]);
      
      useEffect(() => {
        drawWheel();
      }, [drawWheel]);
      
      const addOption = () => {
        if (inputValue.trim() && options.length < 24) {
          setOptions([...options, inputValue.trim()]);
          setInputValue('');
        }
      };
      
      const removeOption = useCallback((index: number) => {
        if (options.length > 1) {
          setOptions(prev => prev.filter((_, i) => i !== index));
        }
      }, [options.length]);
      
      const updateOption = useCallback((index: number, newVal: string) => {
        setOptions(prev => {
          const next = [...prev];
          next[index] = newVal;
          return next;
        });
      }, []);
      
      const handleSpin = () => {
        if (isSpinning || options.length < 2) return;
        setIsSpinning(true);
        setWinner(null);
        const extraRotations = 8 + Math.random() * 5;
        const randomStop = Math.random() * 360;
        const newRotation = rotation + (extraRotations * 360) + randomStop;
        setRotation(newRotation);
        setTimeout(() => {
          setIsSpinning(false);
          const normalizedRotation = newRotation % 360;
          const sliceDeg = 360 / options.length;
          const initialAngleAtPointer = (270 - normalizedRotation + 3600) % 360;
          const winnerIndex = Math.floor(initialAngleAtPointer / sliceDeg);
          setWinner(options[winnerIndex]);
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.5 }, colors: THEME_COLORS });
        }, 5000);
      };
      
      return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col items-center py-12 px-6 md:py-24 relative overflow-x-hidden">
          
          <div className="w-full max-w-4xl relative z-10 flex flex-col items-center space-y-20">
            
            {/* Header - Ultra Minimal */}
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight">چرخونه تصمیم</h1>
              <p className="text-muted-foreground font-medium text-lg">گزینه‌ها را بنویسید، برنده را سرنوشت تعیین می‌کند.</p>
            </div>
      
            {/* The Wheel - Centered Hero */}
            <div className="relative">
              {/* Pointer - Modern Needle */}
              <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 z-20">
                <div className="w-1.5 h-10 bg-primary rounded-full shadow-xl" />
              </div>
      
              <div className="p-3 rounded-full border-2 border-border shadow-[0_0_100px_rgba(0,0,0,0.05)] bg-card">
                <motion.canvas
                  ref={canvasRef}
                  width={550}
                  height={550}
                  animate={{ rotate: rotation }}
                  transition={{ duration: 5, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-full w-[300px] h-[300px] md:w-[500px] md:h-[500px] cursor-pointer"
                  onClick={handleSpin}
                />
              </div>
      
              {/* Master Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <button 
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <RotateCw className={`w-8 h-8 ${isSpinning ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
              {/* Options Management - Clean Chip List */}
        <div className="w-full max-w-3xl space-y-10" dir="rtl">
          {/* Add Option Input */}
          <div className="relative max-w-md mx-auto">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption()}
              placeholder="گزینه جدید را بنویسید..."
              className="w-full bg-card border border-border rounded-2xl px-6 py-4 text-lg outline-none focus:border-primary transition-all text-right pr-12 shadow-sm"
            />
            <Plus className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary cursor-pointer" onClick={addOption} />
          </div>

          {/* Chips Grid */}
          <div className="flex flex-wrap justify-center gap-3">
            <AnimatePresence mode="popLayout">
              {options.map((opt, i) => (
                <OptionChip 
                  key={`${opt}-${i}`} 
                  opt={opt} 
                  index={i} 
                  onRemove={removeOption} 
                  onUpdate={updateOption} 
                />
              ))}
            </AnimatePresence>
            
            {options.length > 0 && (
              <button 
                onClick={() => setOptions([])}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
              >
                پاک کردن همه
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cinematic Reveal */}
      <AnimatePresence>
        {winner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-background/98 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center space-y-12"
            >
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-[2.5rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-muted-foreground uppercase tracking-widest">انتخاب نهایی</h2>
                <div className="text-6xl md:text-[8rem] font-black font-sans text-foreground leading-tight">
                  {winner}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                <button 
                  onClick={() => { setWinner(null); handleSpin(); }}
                  className="px-16 py-5 bg-primary text-primary-foreground rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                  دوباره بچرخون
                </button>
                <button 
                  onClick={() => setWinner(null)}
                  className="px-16 py-5 rounded-full bg-secondary text-muted-foreground font-bold text-xl hover:text-foreground transition-all"
                >
                  بستن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Brand Footer */}
      <div className="mt-32 text-center pb-20 opacity-20 hover:opacity-100 transition-opacity cursor-default">
        <div className="text-[10px] font-black tracking-[0.5em] text-zinc-500 uppercase">
          BAGHAEI TECHNOLOGY GROUP
        </div>
      </div>
    </main>
  );
}