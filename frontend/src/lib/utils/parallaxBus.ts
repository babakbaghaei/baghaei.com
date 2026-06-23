// Cross-component parallax bus (a plain mutable singleton — intentionally no
// React state, so reads happen every animation frame with zero re-renders).
//
// The home page's projects section is a sticky-pin: vertical page scroll is
// translated into HORIZONTAL card motion. Without this signal the global star
// field drifts vertically while the cards slide sideways — visually wrong.
// While the pin is active, `pinActive` is true and `hx` is its 0..1 progress,
// so the star field travels horizontally with the cards and holds its vertical
// drift. Outside the pin both fall back to defaults (normal vertical parallax).
export const parallaxBus = {
  pinActive: false,
  hx: 0,
};
