import React, { FC } from "react";

type TextPreset =
  | "preset-1"
  | "preset-2"
  | "preset-3"
  | "preset-4"
  | "preset-4-bold"
  | "preset-5"
  | "preset-5-bold";

const textPresets: Record<TextPreset, string> = {
  "preset-1": "text-[32px] font-bold leading-tight",
  "preset-2": "text-xl font-bold leading-tight",
  "preset-3": "text-base font-bold leading-normal",
  "preset-4": "text-sm font-normal leading-normal",
  "preset-4-bold": "text-sm font-bold leading-normal",
  "preset-5": "text-xs font-normal leading-normal",
  "preset-5-bold": "text-xs font-bold leading-normal",
};

interface TypographyProps {
  preset?: TextPreset;
  tag?: keyof JSX.IntrinsicElements; // Allows 'div', 'h1', 'p', 'span', etc.
  className?: string; // For additional Tailwind classes
  children: React.ReactNode;
}

const Typography: FC<TypographyProps> = ({
  preset = "preset-1",
  tag = "p",
  className = "text-grey-900",
  children,
  ...props
}) => {
  const Tag = tag;
  const presetClasses = textPresets[preset];
  const combinedClasses = `${presetClasses} ${className}`;

  return (
    <Tag className={combinedClasses} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;
