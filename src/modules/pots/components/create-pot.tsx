import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/modal";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Button } from "@/components/ui/button";
import THEME_OPTIONS from "@/utils/theme-options";

const formSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  target: z.string().min(1, { message: "Required" }),
  theme: z.string().min(1, { message: "Required" }),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreatePot = ({ isOpen, onClose }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      target: "",
      theme: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
    onClose();
  };

  return (
    <Modal
      title="Add New Pot"
      description="Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Pot Name"
            placeholder="e.g. Rainy Days"
            control={form.control}
          />
          <FormInput
            name="target"
            label="Target"
            placeholder="e.g. 2000"
            control={form.control}
          />
          <FormSelect
            name="theme"
            label="Theme"
            placeholder="Theme"
            control={form.control}
            options={THEME_OPTIONS}
          />

          <Button className="w-full" size="xl" type="submit">
            Add Pot
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default CreatePot;
