import {
  FormControl,
  // FormDescription,
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
            {/* <Select onValueChange={field.onChange}> */}
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
                {/* {field.value || }
                </SelectValue> */}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <FormDescription>
            You can manage email addresses in your{" "}
            <Link href="/examples/forms">email settings</Link>.
          </FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
