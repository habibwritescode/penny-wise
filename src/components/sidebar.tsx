import { cn } from "@/lib/utils";
import { SIDEBAR_COLLAPSE } from "@/utils/constants";
import { type SidebarMode } from "./sidebar-mode";
import { TooltipProvider } from "./ui/tooltip";

type Props = {
  mode: SidebarMode;
  children: React.ReactNode;
};

// Shown from lg; keep in sync with bottom-nav.tsx (lg:hidden) and the
// lg:ml-* offset in layout/main-layout.tsx.
const Sidebar = ({ mode, children }: Props) => {
  return (
    <aside
      className={cn(
        // overflow-hidden clips labels and the full logo as the width narrows.
        "z-10 hidden lg:block fixed bg-grey-900 h-screen supports-[height:100dvh]:h-dvh rounded-r-[15px] overflow-hidden",
        "pt-10 pr-6 pb-[76px]",
        {
          auto: "w-[88px] xl:w-[300px]",
          expanded: "w-[300px]",
          collapsed: "w-[88px]",
        }[mode],
        SIDEBAR_COLLAPSE
      )}
    >
      {/* After the first tooltip, moving to the next item shows its tooltip
          at once (Radix's skip delay). */}
      <TooltipProvider delayDuration={400} skipDelayDuration={300}>
        {children}
      </TooltipProvider>
    </aside>
  );
};

export default Sidebar;
