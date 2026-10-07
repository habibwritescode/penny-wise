import { describe, expect, it } from "vitest";
import { getSegments } from "@/components/multi-part-progress";

describe("getSegments", () => {
  it("puts the coloured part directly after the dark part", () => {
    expect(getSegments(200, 50, 30)).toEqual({ currentPercent: 25, endPercent: 40 });
  });
  it("clamps to the track", () => {
    expect(getSegments(100, 90, 50)).toEqual({ currentPercent: 90, endPercent: 100 });
    expect(getSegments(100, -10, 5)).toEqual({ currentPercent: 0, endPercent: 0 });
  });
  it("handles a zero target", () => {
    expect(getSegments(0, 10, 10)).toEqual({ currentPercent: 0, endPercent: 0 });
  });
});
