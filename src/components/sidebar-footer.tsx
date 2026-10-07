import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import useBoundStore from "@/lib/store/store";
import { SIDEBAR_TRANSITION } from "@/utils/constants";

import ArrowIcon from "../../public/assets/icons/arrow-minimize.svg";
import Typography from "./typography";

interface Props {
  isExpanded: boolean;
  handleToggle: () => void;
}

type ActionProps = React.ComponentProps<"button"> & {
  isExpanded: boolean;
  icon: React.ReactElement;
  label: string;
};

const SidebarAction = ({ isExpanded, icon, label, ...props }: ActionProps) => (
  <button type="button" className="w-full group" aria-label={label} {...props}>
    <div
      className={cn(
        "flex items-center gap-4",
        isExpanded ? "pl-9" : "justify-center"
      )}
    >
      {icon}
      <Typography
        variant="preset-3"
        className={cn(
          "overflow-hidden whitespace-nowrap text-grey-500 group-hover:text-grey-100",
          isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0",
          SIDEBAR_TRANSITION
        )}
      >
        {label}
      </Typography>
    </div>
  </button>
);

const SidebarFooter = ({ isExpanded, handleToggle }: Props) => {
  const signOut = useBoundStore((store) => store.signOut);

  return (
    <div className="absolute bottom-20 w-full flex flex-col gap-6">
      <SidebarAction
        isExpanded={isExpanded}
        label="Log Out"
        onClick={signOut}
        icon={
          <LogOut className="h-5 w-5 shrink-0 text-[#B3B3B3] group-hover:text-grey-100" />
        }
      />
      <SidebarAction
        isExpanded={isExpanded}
        label={isExpanded ? "Minimize Menu" : "Expand Menu"}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        icon={
          <ArrowIcon
            className={cn(
              "shrink-0 text-[#B3B3B3] group-hover:text-grey-100",
              !isExpanded && "-rotate-180",
              SIDEBAR_TRANSITION
            )}
          />
        }
      />
    </div>
  );
};

export default SidebarFooter;
