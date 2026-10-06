import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Options = {
  name: string | React.ReactElement;
  value: string;
  disabled?: boolean;
};

type Props = {
  options: Options[];
  label: string;
  placeholder: string;
  name: string;
  control: any;
  disabled?: boolean;
};

const FormSelect = ({
  control,
  label,
  placeholder,
  options,
  name,
  disabled,
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem key={`key${field.value}`}>
          <FormLabel className="text-grey-500">{label}</FormLabel>

          <Select
            onValueChange={field.onChange}
            disabled={disabled}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="grid grid-cols-1"
                >
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
