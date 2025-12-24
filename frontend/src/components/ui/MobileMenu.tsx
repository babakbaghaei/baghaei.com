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
  closed: { opacity: 0, y: "-100%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
  open: { opacity: 1, y: "0%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
};

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, links, onClose, onLinkClick }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          variants={menuVariants} 
          initial="closed" 
          animate="open" 
          exit="closed" 
          className="fixed inset-0 bg-black z-[120] flex flex-col justify-center px-12"
        >
          <button 
            onClick={onClose} 
            className="absolute top-8 left-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
          >
            <span className="text-sm font-black uppercase font-display">بازگشت</span>
            <X className="w-6 h-6" />
          </button>
          
          <div className="space-y-8">
            {links.map((link) => (
              <button 
                key={link.id} 
                onClick={() => onLinkClick(link.id)} 
                className="text-5xl font-black font-display text-white text-right block w-full hover:text-zinc-400 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
