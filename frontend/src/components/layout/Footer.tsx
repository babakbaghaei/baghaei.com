import React from 'react';
import { Github, Linkedin, Instagram, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-2 border-gray-800 py-20 overflow-hidden">
        <div className="w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <div className="text-base font-black text-white mb-2">Baghaei Tech Group</div>
                        <p className="text-sm text-gray-300 font-sans leading-relaxed">
                            Developing enterprise software for over 10 years. Trusted by 14+ major companies.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-base font-black text-white mb-2">Services</div>
                        <div className="flex flex-col gap-2">
                            <a href="#services" className="text-sm font-sans text-gray-300 hover:text-white transition-all">Experience Design</a>
                            <a href="#services" className="text-sm font-sans text-gray-300 hover:text-white transition-all">Systems Architecture</a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="text-base font-black text-white mb-2">Careers</div>
                        <div className="flex flex-col gap-2">
                            <a href="/careers" className="text-sm font-sans text-gray-300 hover:text-white transition-all">View Openings</a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="text-base font-black text-white mb-2">Contact</div>
                        <div className="flex flex-col gap-4">
                            <a href="mailto:baabakbaghaaei@gmail.com" className="text-sm font-sans text-gray-300 hover:text-white transition-all flex items-center gap-3">
                                baabakbaghaaei@gmail.com
                            </a>
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                <Github className="w-6 h-6" />
                                <Linkedin className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-400 font-sans">&copy; 2024 Baghaei Tech Group. All rights reserved.</div>
                </div>
            </div>
        </div>
    </footer>
  );
}
