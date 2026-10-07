import * as React from "react";
import MenuIcon from "../../public/assets/icons/dots-horizontal.svg";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Item {
  onSelect: () => void;
  name: string;
  className?: string;
}
type Props = {
  items: Item[];
  trigger?: React.ReactElement;
  // Accessible name for the menu button, e.g. "Actions for Rent" in a list.
  label?: string;
};

const ActionDropdown = ({ items, trigger, label = "Actions" }: Props) => {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-1 shrink-0">
            <span className="sr-only">{label}</span>
            {trigger || <MenuIcon />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {items.map((item) => (
            <DropdownMenuItem
              key={item.name}
              onSelect={item.onSelect}
              className={item.className}
            >
              {item.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionDropdown;
