import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/modal";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/utils/constants";
import useBoundStore from "@/lib/store/store";
import { IBudget } from "@/utils/types";
import { useEffect, useMemo } from "react";
import getThemeOptions from "@/utils/theme-options";

const CATEGORY_OPTIONS = CATEGORIES.map((item) => ({
  name: item,
  value: item,
}));

const formSchema = z.object({
  category: z.string().min(1, { message: "Required" }),
  maximum: z.string().min(1, { message: "Required" }),
  theme: z.string().min(1, { message: "Required" }),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  budget?: IBudget;
  type?: "add" | "edit";
};

const AddBudget = ({ isOpen, onClose, budget, type }: Props) => {
  const createBudget = useBoundStore((store) => store.createBudget);
  const budgets = useBoundStore((store) => store.budgets);

  const isEdit = type === "edit";

  const themeOptions = useMemo(() => getThemeOptions(budgets), [budgets]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: budget?.category || "",
      maximum: budget?.maximum ? String(budget?.maximum) : "",
      theme: budget?.theme || "",
    },
  });

  const { reset } = form;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createBudget({
      category: values.category,
      maximum: Number(values.maximum),
      theme: values.theme,
    });

    onClose();
  };

  useEffect(() => {
    reset({
      category: budget?.category || "",
      maximum: budget?.maximum ? String(budget?.maximum) : "",
      theme: budget?.theme || "",
    });
  }, [budget, reset]);

  return (
    <Modal
      title={isEdit ? "Edit Budget" : "Add New Budget"}
      description={
        isEdit
          ? "As your budgets change, feel free to update your spending limits."
          : "Choose a category to set a spending budget. These categories can help you monitor spending."
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormSelect
            name="category"
            label="Budget Category"
            placeholder="Select Category"
            control={form.control}
            options={CATEGORY_OPTIONS}
            disabled={isEdit}
          />
          <FormInput
            name="maximum"
            placeholder="Maximum Spend"
            label="Maximum Spend"
            control={form.control}
          />
          <FormSelect
            name="theme"
            label="Theme"
            placeholder="Theme"
            control={form.control}
            options={themeOptions}
          />

          <Button className="w-full" size="xl" type="submit">
            {isEdit ? "Save Changes" : "Add Budget"}
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddBudget;
