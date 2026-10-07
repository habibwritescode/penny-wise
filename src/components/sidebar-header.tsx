import Image from "next/image";

import { cn } from "@/lib/utils";
import { SIDEBAR_COLLAPSE } from "@/utils/constants";

interface Props {
  isExpanded: boolean;
}

// Both logos sit in the same grid cell and crossfade at full size (the sidebar
// clips the wordmark as it narrows). The padding lines them up with the nav
// icons in both states: 40px expanded, 24px collapsed.
const SidebarHeader = ({ isExpanded }: Props) => {
  return (
    <div
      className={cn(
        "grid h-6 [&>*]:col-start-1 [&>*]:row-start-1",
        isExpanded ? "pl-10" : "pl-6",
        SIDEBAR_COLLAPSE
      )}
    >
      <Image
        className="sidebar-fade max-w-none"
        data-hidden={!isExpanded}
        src="/logo-full.svg"
        alt="Pennywise"
        aria-hidden={!isExpanded}
        width={134.73}
        height={24}
        priority
      />
      <Image
        className="sidebar-fade max-w-none"
        data-hidden={isExpanded}
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
