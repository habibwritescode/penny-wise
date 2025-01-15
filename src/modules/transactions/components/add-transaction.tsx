import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/modal";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import useBoundStore from "@/lib/store/store";
import FormSelect from "@/components/form-select";
import { CATEGORIES } from "@/utils/constants";
import DatePicker from "@/components/date-picker";
import Checkbox from "@/components/checkbox";

const CATEGORY_OPTIONS = CATEGORIES.map((item) => ({
  name: item,
  value: item,
}));

const TYPE_OPTIONS = ["Income", "Expense"].map((item) => ({
  name: item,
  value: item,
}));

const formSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  category: z.string().min(1, { message: "Required" }),
  date: z.date({
    message: "Required",
  }),
  amount: z.string().min(1, { message: "Required" }),
  recurring: z.boolean().default(false),
  type: z.enum(["Income", "Expense"], {
    errorMap: () => ({ message: "Invalid type" }),
  }),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AddTransaction = ({ isOpen, onClose }: Props) => {
  const createTransaction = useBoundStore((store) => store.createTransaction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      type: undefined,
      date: new Date(),
      category: "",
      recurring: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTransaction({
      id: crypto.randomUUID(),
      // avatar: values.avatar,
      name: values.name,
      amount: Number(values.amount),
      type: values.type,
      date: values.date.toISOString(),
      category: values.category,
      recurring: values.recurring,
    });

    form.reset();
    onClose();
  };

  return (
    <Modal
      title="Add Transaction"
      description="Record your transaction"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            placeholder="Name of Recipient/Sender"
            label="Name of Recipient/Sender"
            control={form.control}
          />
          <FormInput
            name="amount"
            inputType="number"
            placeholder="Amount"
            label="Amount"
            control={form.control}
          />
          <FormSelect
            name="type"
            label="Type"
            placeholder="Select Type"
            control={form.control}
            options={TYPE_OPTIONS}
          />
          <DatePicker
            name="date"
            label="Transaction Date"
            control={form.control}
          />
          <FormSelect
            name="category"
            label="Category"
            placeholder="Select Category"
            control={form.control}
            options={CATEGORY_OPTIONS}
          />
          <Checkbox
            label="Mark as Recurring?"
            name="recurring"
            control={form.control}
            description="This transaction will repeat on a regular basis"
          />

          <Button className="w-full" size="xl" type="submit">
            Add Transaction
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddTransaction;
