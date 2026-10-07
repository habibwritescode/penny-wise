import { useEffect, useState } from "react";
import useBoundStore from "@/lib/store/store";

// The store rehydrates from IndexedDB after mount (see _app), so anything
// that depends on persisted state must wait for this before deciding.
// Start from the store's real state so later mounts (e.g. after login) don't
// flash the skeleton. On the server `persist` isn't attached (no localStorage),
// and on the first client render it is still false, matching the server HTML.
const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState(
    () => typeof window !== "undefined" && useBoundStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsubscribe = useBoundStore.persist.onFinishHydration(() =>
      setHasHydrated(true)
    );
    setHasHydrated(useBoundStore.persist.hasHydrated());

    return unsubscribe;
  }, []);

  return hasHydrated;
};

export default useHasHydrated;
