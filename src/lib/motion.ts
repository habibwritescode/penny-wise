// Shared timing for exits that must finish before the data changes (so a card
// or row can fade out before it's removed). Matches globals.css.
export const LEAVE_MS = 150;
export const COLLAPSE_MS = 200;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
