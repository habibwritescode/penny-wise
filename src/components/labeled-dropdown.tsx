import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Typography from "./typography";

type Option = {
  name: string;
  value: string;
};

type Props = {
  options: Option[];
  label: string;
  onChange: (value: string) => void;
};

export function LabeledDropdown({ options, label, onChange }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <Typography
        variant="preset-4"
        className="text-grey-500 min-w-fit"
        tag="label"
      >
        {label}
      </Typography>
      <Select onValueChange={onChange} defaultValue={options[0].value}>
        <SelectTrigger className="gap-4">
          <SelectValue placeholder={options[0].name} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
