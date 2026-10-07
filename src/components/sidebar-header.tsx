import Image from "next/image";

import { cn } from "@/lib/utils";
import { SIDEBAR_TRANSITION } from "@/utils/constants";

interface Props {
  isExpanded: boolean;
}

const SidebarHeader = ({ isExpanded }: Props) => {
  return (
    <div className="relative ml-9 h-6">
      <Image
        className={cn(
          "absolute",
          SIDEBAR_TRANSITION,
          !isExpanded && "opacity-0 max-w-0"
        )}
        src="/logo-full.svg"
        alt="Pennywise"
        aria-hidden={!isExpanded}
        width={134.73}
        height={24}
        priority
      />
      <Image
        className={cn(
          "absolute",
          SIDEBAR_TRANSITION,
          isExpanded && "opacity-0 max-w-0"
        )}
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
