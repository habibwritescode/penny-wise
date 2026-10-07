import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import useBoundStore from "@/lib/store/store";
import { SIDEBAR_COLLAPSE } from "@/utils/constants";

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
  // Accessible name when it differs from the visible label.
  ariaLabel?: string;
};

// Icons stay put and line up with the nav icons (40px expanded, 24px
// collapsed, animated); the label fades and is clipped by the sidebar.
const SidebarAction = ({
  isExpanded,
  icon,
  label,
  ariaLabel,
  ...props
}: ActionProps) => (
  <button
    type="button"
    className="w-full group"
    aria-label={ariaLabel ?? label}
    {...props}
  >
    <div
      className={cn(
        "flex items-center gap-4",
        isExpanded ? "pl-10" : "pl-6",
        SIDEBAR_COLLAPSE
      )}
    >
      {icon}
      <Typography
        variant="preset-3"
        data-hidden={!isExpanded}
        className="shrink-0 whitespace-nowrap text-grey-500 group-hover:text-grey-100 sidebar-fade"
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
          <LogOut className="h-5 w-5 shrink-0 text-[#B3B3B3] transition-colors duration-150 group-hover:text-grey-100" />
        }
      />
      <SidebarAction
        isExpanded={isExpanded}
        // The visible text only shows while expanded, so it never changes;
        // swapping it on click would show "Expand Menu" as it fades out.
        label="Minimize Menu"
        ariaLabel={isExpanded ? "Minimize Menu" : "Expand Menu"}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        icon={
          <ArrowIcon
            className={cn(
              "shrink-0 text-[#B3B3B3] group-hover:text-grey-100",
              !isExpanded && "-rotate-180",
              SIDEBAR_COLLAPSE
            )}
          />
        }
      />
    </div>
  );
};

export default SidebarFooter;
