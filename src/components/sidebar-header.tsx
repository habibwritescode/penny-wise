import Image from "next/image";

import { cn } from "@/lib/utils";

interface Props {
  isExpanded: boolean;
  transitionClasses: string;
}

const SidebarHeader = ({ isExpanded, transitionClasses }: Props) => {
  return (
    <div className="relative ml-9 h-6">
      <Image
        className={cn(
          "absolute",
          transitionClasses,
          !isExpanded && "opacity-0 max-w-0"
        )}
        src="/logo-full.svg"
        alt="logo"
        width={121.45}
        height={21.76}
        priority
      />
      <Image
        className={cn(
          "absolute",
          transitionClasses,
          isExpanded && "opacity-0 max-w-0"
        )}
        src="/logo-min.svg"
        alt="logo"
        width={12.48}
        height={21.76}
        priority
      />
    </div>
  );
};

export default SidebarHeader;
