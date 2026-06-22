'use client';

// Sound effects were removed by request. `useSound()` is kept as a no-op so the
// existing callers (Button, ThemeToggle, CommandMenu) need no changes — calling
// `play()` simply does nothing now. No AudioContext, no network, no UI.
export function useSound() {
  return {
    play: (name?: string) => {
      void name; // intentionally no-op
    },
  };
}
