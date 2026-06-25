// ── Solar-system display scale (shared, dependency-free) ─────────────────────
// PURELY VISUAL knobs for the foreground orrery. Kept in their own tiny module
// so Hero + the dev panel can import the defaults WITHOUT pulling in the heavy
// GlobalUniverse canvas/ephemeris module (which stays lazy-loaded). The live
// ephemeris/longitude math is untouched by any of these, so positions, eclipses
// and Moon phase stay astronomically exact at every scale.
export interface SolarScale {
  zoom: number;        // master multiplier on sun + planet sizes AND orbit distances
  sizeBase: number;    // Earth's on-screen diameter (px) before zoom
  distSpan: number;    // Neptune's orbit radius ×frame diagonal before zoom
  sizeExp: number;     // diameter-ratio exponent (1 = exact; <1 evens worlds out)
  sunSize: number;     // Sun core diameter (px) before zoom
  sunGlow: number;     // Sun halo spread + brightness (0 = bare disc, 1 = stock)
  sunOpacity: number;  // overall Sun opacity (0..1)
  sunCx: number;       // Sun centre X — viewport fraction (0 = left corner)
  sunCy: number;       // Sun centre Y — viewport fraction (0 = top corner)
  orbitOpacity: number; // concentric orbit-ring line opacity (0 = hidden)
  ambientGlow: number;  // warm corner-light scatter intensity (×, 0 = off)
}

export const DEFAULT_SCALE: SolarScale = {
  zoom: 0.2,       // small, distant system tucked in the corner
  sizeBase: 30,    // Earth's base diameter (px) before zoom
  distSpan: 12,    // wide orbit spread (ratios stay exact)
  sizeExp: 1.0,    // EXACT diameter ratio
  sunSize: 30,     // small Sun core
  sunGlow: 3,      // wide, bright halo
  sunOpacity: 0.1, // disc nearly dissolved — mostly its glow reads
  sunCx: 0.0,      // left corner
  sunCy: 1.0,      // bottom corner
  orbitOpacity: 0.05, // very faint rings
  ambientGlow: 1,  // stock warm scatter
};
