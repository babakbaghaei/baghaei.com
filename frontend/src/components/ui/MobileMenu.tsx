'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NavLink {
 id: string;
 label: string;
}

interface MobileMenuProps {
 isOpen: boolean;
 links: NavLink[];
 onClose: () => void;
 onLinkClick: (id: string) => void;
}

const menuVariants = {
 closed: { 
  opacity: 0, 
  pointerEvents: 'none' as const,
  transition: { duration: 0.4, ease: "easeInOut" } 
 },
 open: { 
  opacity: 1, 
  pointerEvents: 'auto' as const,
  transition: { duration: 0.5, ease: "easeOut" } 
 }
};

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, links, onClose, onLinkClick }) => {
 return (
  <AnimatePresence>
   {isOpen && (
    <motion.div 
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 bg-black z-[99999]"
     style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100dvh', width: '100vw' }}
    >
     <div className="relative h-full w-full flex flex-col justify-center px-12 overflow-hidden">
      <button 
       onClick={onClose} 
       className="absolute top-10 left-8 flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group z-[100000]"
      >
       <span className="text-xs font-black uppercase tracking-widest font-display">برگشت</span>
       <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30">
        <X className="w-5 h-5" />
       </div>
      </button>
      
      <div className="space-y-6">
       {links.map((link, i) => (
        <motion.button 
         key={link.id} 
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: 0.1 + i * 0.05 }}
         onClick={() => onLinkClick(link.id)} 
         className="text-5xl font-black font-display text-white text-right block w-full hover:text-zinc-500 transition-all active:scale-95"
        >
         {link.label}
        </motion.button>
       ))}
      </div>
     </div>
    </motion.div>
   )}
  </AnimatePresence>
 );
};
