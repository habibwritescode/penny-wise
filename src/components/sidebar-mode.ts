// The sidebar's width preference. "auto" (the default) is collapsed below
// 1280px and expanded from 1280px, decided purely by CSS breakpoints, so the
// server-rendered shell is already right and nothing animates on load. Using
// the toggle switches to an explicit "expanded" / "collapsed".
//
// Components write each mode's classes out in full ({ auto: …, … }[mode]):
// Tailwind only generates class names it can see.
export type SidebarMode = "auto" | "expanded" | "collapsed";

// data-hidden values for .sidebar-fade (see globals.css).
export type SidebarHidden = "true" | "false" | "below-xl" | "xl-up";

// Labels and the full logo show when expanded; the small logo when collapsed.
export const hiddenWhenCollapsed = (mode: SidebarMode) =>
  ({ auto: "below-xl", expanded: "false", collapsed: "true" } as const)[mode];
export const hiddenWhenExpanded = (mode: SidebarMode) =>
  ({ auto: "xl-up", expanded: "true", collapsed: "false" } as const)[mode];
