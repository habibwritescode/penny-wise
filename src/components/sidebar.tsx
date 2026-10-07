import { cn } from "@/lib/utils";
import { SIDEBAR_COLLAPSE } from "@/utils/constants";

type Props = {
  isExpanded: boolean;
  children: React.ReactNode;
};

// Shown from lg; keep in sync with bottom-nav.tsx (lg:hidden) and the
// lg:ml-* offset in layout/main-layout.tsx.
const Sidebar = ({ isExpanded, children }: Props) => {
  return (
    <aside
      className={cn(
        // overflow-hidden clips labels and the full logo as the width narrows.
        "z-10 hidden lg:block fixed bg-grey-900 h-screen rounded-r-[15px] overflow-hidden",
        "pt-10 pr-6 pb-[76px]",
        isExpanded ? "w-[300px]" : "w-[88px]",
        SIDEBAR_COLLAPSE
      )}
    >
      {children}
    </aside>
  );
};

export default Sidebar;
