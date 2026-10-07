import { useRef } from "react";

/**
 * Tracks which keys have appeared since the component first rendered.
 * Keys present on the first render are "seen"; a key that disappears is
 * forgotten, so if it comes back (e.g. via Undo) it counts as new again.
 */
export const trackNewKeys = (
  seen: Set<string> | null,
  keys: readonly string[]
) => {
  if (!seen) return { seen: new Set(keys), isNew: () => false };

  const current = new Set(keys);
  seen.forEach((key) => {
    if (!current.has(key)) seen.delete(key);
  });
  return { seen, isNew: (key: string) => current.has(key) && !seen.has(key) };
};

// Lets entrance animations run only for things added during the visit, never
// for everything on page load.
const useNewSinceMount = (keys: readonly string[]) => {
  const seen = useRef<Set<string> | null>(null);
  const tracked = trackNewKeys(seen.current, keys);
  seen.current = tracked.seen;
  return tracked.isNew;
};

export default useNewSinceMount;
