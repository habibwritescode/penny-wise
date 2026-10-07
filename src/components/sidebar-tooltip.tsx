import { useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  label: string;
  // Only the collapsed sidebar hides its labels, so only it shows tooltips.
  isExpanded: boolean;
  children: React.ReactElement;
};

// Names an icon-only sidebar item on hover or keyboard focus. Always rendered
// (so toggling the sidebar never remounts the item), but held closed while
// the labels are visible.
const SidebarTooltip = ({ label, isExpanded, children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open && !isExpanded} onOpenChange={setOpen}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
};

export default SidebarTooltip;
