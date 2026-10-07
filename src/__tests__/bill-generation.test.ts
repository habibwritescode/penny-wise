import { describe, expect, it } from "vitest";

import { shouldGenerate } from "@/lib/store/use-bill-generation";

describe("shouldGenerate", () => {
  it("runs on first load and on a new day, not twice on the same day", () => {
    expect(shouldGenerate(null, "2025-06-10")).toBe(true);
    expect(shouldGenerate("2025-06-10", "2025-06-10")).toBe(false);
    expect(shouldGenerate("2025-06-10", "2025-06-11")).toBe(true);
  });
});
