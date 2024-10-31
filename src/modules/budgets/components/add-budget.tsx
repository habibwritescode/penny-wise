import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "../../../components/modal";
import { Form } from "../../../components/ui/form";
import FormInput from "../../../components/form-input";
import FormSelect from "../../../components/form-select";
import { Button } from "../../../components/ui/button";
import { CATEGORIES } from "@/utils/constants";
import data from "@/utils/data.json";
import THEME_OPTIONS from "../utils/theme-options";

const CATEGORY_OPTIONS = CATEGORIES.map((item) => ({
  name: item,
  value: item,
}));

const formSchema = z.object({
  category: z.string().min(1, { message: "Required" }),
  spend: z.string().min(1, { message: "Required" }),
  theme: z.string().min(1, { message: "Required" }),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AddBudget = ({ isOpen, onClose }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      spend: "",
      theme: "",
    },
  });

  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // if (!isMounted) {
  //   return null;
  // }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
    onClose();
  };

  return (
    <Modal
      title="Add New Budget"
      description="Choose a category to set a spending budget. These categories can help you monitor spending."
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
          />
          <FormInput
            name="spend"
            placeholder="Maximum Spend"
            label="Maximum Spend"
            control={form.control}
          />
          <FormSelect
            name="theme"
            label="Theme"
            placeholder="Theme"
            control={form.control}
            options={THEME_OPTIONS}
          />

          <Button className="w-full" type="submit">
            Add Budget
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddBudget;
