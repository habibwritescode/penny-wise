
import { cn } from "@/lib/utils";

import ArrowIcon from "../../public/assets/icons/arrow-minimize.svg";
import Typography from "./typography";

interface Props {
  isExpanded: boolean;
  handleToggle: () => void;
  transitionClasses: string;
}

const SidebarFooter = ({ isExpanded, handleToggle, transitionClasses }: Props) => {
  return (
    <div
      className="absolute bottom-20 cursor-pointer w-full group"
      onClick={handleToggle}
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
            transitionClasses
          )}
        />
        <Typography
          variant="preset-3"
          className={cn(
            "text-grey-500 group-hover:text-grey-100",
            isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0",
            transitionClasses
          )}
        >
          Minimize Menu
        </Typography>
      </div>
    </div>
  );
};

export default SidebarFooter;
