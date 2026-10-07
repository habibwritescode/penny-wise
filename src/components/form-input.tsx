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
  inputType?: "number" | "text" | "password";
  disabled?: boolean;
};

const FormInput = ({
  control,
  name,
  label,
  placeholder,
  inputType = "text",
  disabled,
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
                type={type}
                disabled={disabled}
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
