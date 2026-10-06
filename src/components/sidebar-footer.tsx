import { cn } from "@/lib/utils";
import { SIDEBAR_TRANSITION } from "@/utils/constants";

import ArrowIcon from "../../public/assets/icons/arrow-minimize.svg";
import Typography from "./typography";

interface Props {
  isExpanded: boolean;
  handleToggle: () => void;
}

const SidebarFooter = ({ isExpanded, handleToggle }: Props) => {
  return (
    <button
      type="button"
      className="absolute bottom-20 w-full group"
      onClick={handleToggle}
      aria-expanded={isExpanded}
      aria-label={isExpanded ? "Minimize menu" : "Expand menu"}
    >
      <div
        className={cn(
          "flex items-center gap-4",
          isExpanded ? "pl-9" : "justify-center"
        )}
      >
        <ArrowIcon
          className={cn(
            "text-[#B3B3B3] group-hover:text-grey-100",
            !isExpanded && "-rotate-180",
            SIDEBAR_TRANSITION
          )}
        />
        <Typography
          variant="preset-3"
          className={cn(
            "overflow-hidden whitespace-nowrap text-grey-500 group-hover:text-grey-100",
            isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0",
            SIDEBAR_TRANSITION
          )}
        >
          Minimize Menu
        </Typography>
      </div>
    </button>
  );
};

export default SidebarFooter;
