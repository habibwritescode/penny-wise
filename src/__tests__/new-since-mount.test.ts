import { describe, expect, it } from "vitest";

import { trackNewKeys } from "@/lib/use-new-since-mount";

describe("trackNewKeys", () => {
  it("treats everything on the first render as already seen", () => {
    const { isNew } = trackNewKeys(null, ["a", "b"]);
    expect(isNew("a")).toBe(false);
    expect(isNew("b")).toBe(false);
  });

  it("marks keys added later as new", () => {
    const { seen } = trackNewKeys(null, ["a"]);
    const { isNew } = trackNewKeys(seen, ["a", "c"]);
    expect(isNew("a")).toBe(false);
    expect(isNew("c")).toBe(true);
  });

  it("treats a key that left and came back (e.g. Undo) as new", () => {
    const { seen } = trackNewKeys(null, ["a"]);
    trackNewKeys(seen, []); // removed
    expect(trackNewKeys(seen, ["a"]).isNew("a")).toBe(true);
  });
});
