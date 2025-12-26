'use client';

const SOUNDS = {
 click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
 hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
 pop: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
};

export const useSound = () => {
 const play = (soundName: keyof typeof SOUNDS) => {
  if (typeof window === 'undefined') return;
  const audio = new Audio(SOUNDS[soundName]);
  audio.volume = 0.15; // Very subtle volume
  audio.play().catch(() => {
   // Ignore errors if browser blocks auto-play
  });
 };

 return { play };
};
