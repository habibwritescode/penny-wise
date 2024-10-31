import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import MenuIcon from "../../public/assets/icons/dots-horizontal.svg";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
};

const ActionDropdown = ({ items, trigger }: Props) => {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="ml-1">
            <span className="sr-only">Actions</span>
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
            // <DropdownMenuSeparator />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionDropdown;
