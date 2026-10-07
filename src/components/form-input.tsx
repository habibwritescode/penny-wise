import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useState } from "react";

type Props = {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  inputType?: "number" | "text" | "password" | "email";
  disabled?: boolean;
  // Autofill hint, e.g. "email", "current-password", "new-password", "name".
  autoComplete?: string;
};

// Keyboard hints for phones: a decimal pad for amounts, and no
// auto-capitalisation or autocorrect on email addresses. These only shape the
// keyboard: forms set noValidate, so zod is the single source of validation
// (and step="any" stops the browser treating 12.50 as invalid for step=1).
const KEYBOARD: Partial<
  Record<NonNullable<Props["inputType"]>, React.InputHTMLAttributes<HTMLInputElement>>
> = {
  number: { inputMode: "decimal", step: "any" },
  email: {
    inputMode: "email",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
  },
};

const FormInput = ({
  control,
  name,
  label,
  placeholder,
  inputType = "text",
  disabled,
  autoComplete,
}: Props) => {
  const [type, setType] = useState(inputType);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-grey-500">{label}</FormLabel>
          {/* FormControl must wrap the input itself: it sets the id the label
              points at, plus aria-invalid / aria-describedby for errors. */}
          <div className="relative">
            <FormControl>
              <Input
                placeholder={placeholder}
                {...field}
                {...KEYBOARD[inputType]}
                type={type}
                disabled={disabled}
                autoComplete={autoComplete}
              />
            </FormControl>

            {inputType === "password" && (
              <button
                type="button"
                className="absolute top-1/2 right-2 transform -translate-y-1/2"
                onClick={() =>
                  setType(type === "password" ? "text" : "password")
                }
                aria-label={
                  type === "password" ? "Show password" : "Hide password"
                }
              >
                {type === "password" ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                </button>
              )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
