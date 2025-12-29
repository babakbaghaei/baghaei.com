'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ children, className }: any) {
  const [copied, setIsCopied] = useState(false);
  const language = className?.replace(/language-/, '') || 'txt';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group my-8 rounded-2xl overflow-hidden border border-white/5 bg-zinc-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/5">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{language}</span>
        <button 
          onClick={copyToClipboard}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-6 overflow-x-auto custom-scrollbar">
        <code className="text-sm font-mono leading-relaxed text-zinc-300">
          {children}
        </code>
      </pre>
    </div>
  );
}
