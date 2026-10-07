import { useEffect } from "react";

import useBoundStore from "@/lib/store/store";
import useHasHydrated from "@/lib/store/use-has-hydrated";
import { todayLocal, type LocalDate } from "@/utils/local-date";

// Generate at most once per calendar day per session. Generation is idempotent
// anyway; this just avoids redundant work on every focus event.
export const shouldGenerate = (lastRun: LocalDate | null, today: LocalDate) =>
  lastRun !== today;

/**
 * Creates due bill occurrences once saved data has loaded, and again when the
 * app comes back into view on a new day (e.g. a tab left open overnight), so
 * bills appear without the user re-adding anything.
 */
const useBillGeneration = () => {
  const hasHydrated = useHasHydrated();
  const generateDue = useBoundStore((store) => store.generateDue);

  useEffect(() => {
    if (!hasHydrated) return;

    let lastRun: LocalDate | null = null;
    const run = () => {
      const today = todayLocal();
      if (!shouldGenerate(lastRun, today)) return;
      lastRun = today;
      generateDue(today);
    };
    const runWhenVisible = () => {
      if (document.visibilityState === "visible") run();
    };

    run();
    window.addEventListener("focus", run);
    document.addEventListener("visibilitychange", runWhenVisible);
    return () => {
      window.removeEventListener("focus", run);
      document.removeEventListener("visibilitychange", runWhenVisible);
    };
  }, [hasHydrated, generateDue]);
};

export default useBillGeneration;
