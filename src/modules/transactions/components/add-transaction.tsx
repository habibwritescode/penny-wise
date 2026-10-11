import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { positiveAmount } from "@/utils/schema";
import { formatTransactionAmount } from "@/utils/formatCurrency";

const CATEGORY_OPTIONS = CATEGORIES.map((item) => ({
  name: item,
  value: item,
}));

const TYPE_OPTIONS = ["Income", "Expense"].map((item) => ({
  name: item,
  value: item,
}));

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .max(40, { message: "Must be 40 characters or fewer" }),
  category: z.string().min(1, { message: "Required" }),
  date: z.date({
    message: "Required",
  }),
  amount: positiveAmount,
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
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTransaction({
      id: crypto.randomUUID(),
      name: values.name,
      amount: Number(values.amount),
      type: values.type,
      date: values.date.toISOString(),
      category: values.category,
    });

    // The new row may land on another page of the table, so confirm it here.
    toast.success("Transaction added", {
      description: `${values.name} · ${formatTransactionAmount({
        amount: Number(values.amount),
        type: values.type,
      })}`,
    });
    handleClose();
  };

  return (
    <Modal
      title="Add Transaction"
      description="Record your transaction"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <Button className="w-full" size="xl" type="submit">
            Add Transaction
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddTransaction;
