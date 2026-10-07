import { useEffect } from "react";
import { useRouter } from "next/router";

import useBoundStore from "@/lib/store/store";
import useHasHydrated from "@/lib/store/use-has-hydrated";
import getAuthRedirect, { Access } from "@/utils/getAuthRedirect";

/**
 * Client-side route guard (see getAuthRedirect for the rules).
 * Returns true once the store has loaded and no redirect is pending.
 */
const useAuthRedirect = (access: Access) => {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const isSignedIn = useBoundStore((store) => store.user !== null);

  const redirectTo = getAuthRedirect(access, hasHydrated, isSignedIn);

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  return hasHydrated && !redirectTo;
};

export default useAuthRedirect;
