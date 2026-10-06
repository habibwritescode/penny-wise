import { cn } from "@/lib/utils";
import { SIDEBAR_TRANSITION } from "@/utils/constants";

type Props = {
  isExpanded: boolean;
  children: React.ReactNode;
};

const Sidebar = ({ isExpanded, children }: Props) => {
  return (
    <aside
      className={cn(
        "z-10 hidden md:block fixed bg-grey-900 h-screen rounded-r-[15px]",
        "pt-10 pr-6 pb-[76px]",
        isExpanded ? "w-[300px]" : "w-[88px]",
        SIDEBAR_TRANSITION
      )}
    >
      {children}
    </aside>
  );
};

export default Sidebar;
