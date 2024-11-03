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
};

const FormSelect = ({ control, label, placeholder, options, name }: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-grey-500">{label}</FormLabel>

          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
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
