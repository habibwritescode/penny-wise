import React, { FC } from "react";
import { cn } from "@/lib/utils";
import type { SidebarHidden } from "./sidebar-mode";

type ITextVariants =
  | "preset-1"
  | "preset-2"
  | "preset-3"
  | "preset-4"
  | "preset-4-bold"
  | "preset-5"
  | "preset-5-bold";

const textPresets: Record<ITextVariants, string> = {
  "preset-1": "text-[32px] font-bold leading-tight",
  "preset-2": "text-xl font-bold leading-tight",
  "preset-3": "text-base font-bold leading-normal",
  "preset-4": "text-sm font-normal leading-normal",
  "preset-4-bold": "text-sm font-bold leading-normal",
  "preset-5": "text-xs font-normal leading-normal",
  "preset-5-bold": "text-xs font-bold leading-normal",
};

// Passed through to the element: `title` (e.g. full text for truncated
// labels), `id` (e.g. a heading referenced by aria-labelledby) and
// `data-hidden` (styling hook, e.g. the sidebar label fade).
interface ITypographyProps {
  title?: string;
  id?: string;
  "data-hidden"?: boolean | SidebarHidden;
  variant?: ITextVariants;
  tag?: keyof JSX.IntrinsicElements; // Allows 'div', 'h1', 'p', 'span', etc.
  className?: string; // For additional Tailwind classes
  children: React.ReactNode;
}

const Typography: FC<ITypographyProps> = ({
  variant = "preset-1",
  tag = "p",
  className,
  children,
  ...props
}) => {
  const Tag = tag;
  const presetClasses = textPresets[variant];

  return (
    <Tag className={cn("text-grey-900", presetClasses, className)} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;
