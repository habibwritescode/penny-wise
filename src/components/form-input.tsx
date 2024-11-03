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
};

const FormInput = ({
  control,
  name,
  label,
  placeholder,
  inputType = "text",
}: Props) => {
  const [type, setType] = useState(inputType);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-grey-500">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input placeholder={placeholder} {...field} type={type} />

              {inputType === "password" && (
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                  {type === "password" ? (
                    <Eye onClick={() => setType("text")} className="w-4 h-4" />
                  ) : (
                    <EyeOff
                      onClick={() => setType("password")}
                      className="w-4 h-4"
                    />
                  )}
                </div>
              )}
            </div>
          </FormControl>
          {/* <FormDescription>This is your public display name.</FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
