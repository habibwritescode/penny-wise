export const CATEGORIES = [
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General",
] as const;

export const COLOURS = {
  Green: "#277C78",
  Yellow: "#F2CDAC",
  Cyan: "#82C9D7",
  Navy: "#626070",
  Red: "#C94736",
  Purple: "#826CB0",
  Turquoise: "#597C7C",
  Brown: "#93674F",
  Magenta: "#934F6F",
  Blue: "#3F82B2",
  "Navy Grey": "#97A0AC",
  "Army Green": "#7F9161",
  Pink: "#BE6C49",
} as const;

export const DEMO_USER = {
  name: "Demo User",
  email: "demo@pennywise.app",
} as const;

// Only the continuous properties that change when the sidebar collapses:
// widths, the left padding that positions icons, and the arrow's rotation.
// Nothing discrete (gap, justify-content, max-width) may change, or it snaps
// on the first frame. Labels and logos fade separately (.sidebar-fade).
export const SIDEBAR_COLLAPSE =
  "transition-[width,margin-left,padding-left,transform] duration-300 ease-in-out-strong motion-reduce:transition-none";
