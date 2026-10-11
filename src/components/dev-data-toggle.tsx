import { useEffect, useState } from "react";

import { currentDataMode } from "@/lib/dev/fixture-mode";
import type { DataMode } from "@/lib/dev/fixtures";

const SEGMENTS: { mode: DataMode | "demo"; label: string }[] = [
  { mode: "demo", label: "Demo" },
  { mode: "worst", label: "Worst case" },
  { mode: "empty", label: "Empty" },
  { mode: "one", label: "One" },
  { mode: "huge", label: "1,000 rows" },
];

// Dev-only switch between the saved data and the stress-test fixtures.
// Hidden under automation so it never covers what browser tests click.
const DevDataToggle = () => {
  const [active, setActive] = useState<DataMode | "demo" | null>(null);

  useEffect(() => {
    if (navigator.webdriver) return;
    setActive(currentDataMode() ?? "demo");
  }, []);

  if (!active) return null;

  const choose = (mode: DataMode | "demo") => {
    const url = new URL(window.location.href);
    url.searchParams.set("data", mode);
    window.location.assign(url);
  };

  return (
    <div
      role="group"
      aria-label="Dev data"
      className="fixed left-1/2 -translate-x-1/2 z-[60] bottom-[calc(92px+env(safe-area-inset-bottom,0px))] lg:bottom-4 flex gap-0.5 rounded-full bg-neutral-200 p-0.5 font-sans text-xs shadow"
    >
      {SEGMENTS.map(({ mode, label }) => (
        <button
          key={mode}
          type="button"
          aria-pressed={active === mode}
          onClick={() => choose(mode)}
          className={
            active === mode
              ? "rounded-full bg-white px-2.5 py-1 text-neutral-900 shadow-sm"
              : "rounded-full px-2.5 py-1 text-neutral-600"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DevDataToggle;
