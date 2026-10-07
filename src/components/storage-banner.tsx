import { useSyncExternalStore } from "react";
import { TriangleAlert } from "lucide-react";

import { appStorage } from "@/lib/store/idb-storage";

// Shown for the rest of the session once IndexedDB fails and the store falls
// back to memory. Fixed above the mobile bottom nav so it never shifts layout.
const StorageBanner = () => {
  const mode = useSyncExternalStore(
    appStorage.subscribe,
    appStorage.getMode,
    () => "indexeddb" as const
  );

  if (mode !== "memory") return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-[68px] sm:bottom-[90px] lg:bottom-6 sm:left-auto sm:right-6 z-50 max-w-sm flex items-start gap-3 rounded-lg bg-grey-900 px-4 py-3 text-sm text-white shadow-lg"
    >
      <TriangleAlert className="h-5 w-5 shrink-0 text-yellow" aria-hidden />
      <p>
        Changes won&apos;t be saved in this browser. Storage is unavailable
        (for example in private browsing).
      </p>
    </div>
  );
};

export default StorageBanner;
