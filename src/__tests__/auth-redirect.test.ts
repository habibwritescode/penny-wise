import { describe, expect, it } from "vitest";
import getAuthRedirect from "@/utils/getAuthRedirect";

describe("getAuthRedirect", () => {
  it.each([
    ["protected", false, false, null],
    ["protected", true, false, "/login"],
    ["protected", true, true, null],
    ["guest", false, true, null],
    ["guest", true, true, "/"],
    ["guest", true, false, null],
  ] as const)(
    "%s page, hydrated=%s, signedIn=%s -> %s",
    (access, hasHydrated, isSignedIn, expected) => {
      expect(getAuthRedirect(access, hasHydrated, isSignedIn)).toBe(expected);
    }
  );
});
