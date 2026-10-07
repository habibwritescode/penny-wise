import { useCallback, useSyncExternalStore } from "react";

// Matches a media query, re-rendering when it changes. On the server (and
// during hydration) it reports false, so markup never mismatches; use it for
// attributes and logic, and CSS breakpoints for anything visual on load.
const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
};

export default useMediaQuery;
