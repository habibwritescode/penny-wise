import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/modal";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Button } from "@/components/ui/button";
import THEME_OPTIONS from "@/utils/theme-options";
import useBoundStore from "@/lib/store/store";
import { useEffect, useMemo } from "react";
import { IPot } from "@/utils/types";

const formSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  target: z.string().min(1, { message: "Required" }),
  theme: z.string().min(1, { message: "Required" }),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  pot?: IPot;
};

const CreatePot = ({ isOpen, onClose, isEdit, pot }: Props) => {
  const createPot = useBoundStore((store) => store.createPot);

  const defaultValues = useMemo(() => {
    return {
      name: pot?.name || "",
      target: pot?.target ? String(pot?.target) : "",
      theme: pot?.theme || "",
    };
  }, [pot]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { reset } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPot({
      name: values.name,
      target: Number(values.target),
      total: pot?.total || 0,
      theme: values.theme,
    });

    handleClose();
  };

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <Modal
      title={isEdit ? "Edit Pot" : "Add New Pot"}
      description={`${isEdit ? "Update" : "Create"} a pot to set savings targets. These can help keep you on track as you save for special purchases.`}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Pot Name"
            placeholder="e.g. Rainy Days"
            control={form.control}
            disabled={isEdit}
          />
          <FormInput
            name="target"
            label="Target"
            placeholder="e.g. 2000"
            control={form.control}
            inputType="number"
          />
          <FormSelect
            name="theme"
            label="Theme"
            placeholder="Theme"
            control={form.control}
            options={THEME_OPTIONS}
          />

          <Button className="w-full" size="xl" type="submit">
            {isEdit ? "Save Changes" : "Add Pot"}
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default CreatePot;
