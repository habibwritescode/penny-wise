import Image from "next/image";

import { cn } from "@/lib/utils";
import { SIDEBAR_COLLAPSE } from "@/utils/constants";
import {
  hiddenWhenCollapsed,
  hiddenWhenExpanded,
  type SidebarMode,
} from "./sidebar-mode";

interface Props {
  mode: SidebarMode;
  // The effective state, for aria-hidden (visuals come from `mode` via CSS).
  isExpanded: boolean;
}

// Both logos sit in the same grid cell and crossfade at full size (the sidebar
// clips the wordmark as it narrows). The padding lines them up with the nav
// icons in both states: 40px expanded, 24px collapsed.
const SidebarHeader = ({ mode, isExpanded }: Props) => {
  return (
    <div
      className={cn(
        "grid h-6 [&>*]:col-start-1 [&>*]:row-start-1",
        {
          auto: "pl-6 xl:pl-10",
          expanded: "pl-10",
          collapsed: "pl-6",
        }[mode],
        SIDEBAR_COLLAPSE
      )}
    >
      <Image
        className="sidebar-fade max-w-none"
        data-hidden={hiddenWhenCollapsed(mode)}
        src="/logo-full.svg"
        alt="Pennywise"
        aria-hidden={!isExpanded}
        width={134.73}
        height={24}
        priority
      />
      <Image
        className="sidebar-fade max-w-none"
        data-hidden={hiddenWhenExpanded(mode)}
        src="/logo-min.svg"
        alt="Pennywise"
        aria-hidden={isExpanded}
        width={18.75}
        height={24}
        priority
      />
    </div>
  );
};

export default SidebarHeader;
