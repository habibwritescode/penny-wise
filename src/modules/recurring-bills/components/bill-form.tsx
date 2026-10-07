import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/modal";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import DatePicker from "@/components/date-picker";
import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";
import useBoundStore from "@/lib/store/store";
import { CATEGORIES } from "@/utils/constants";
import { positiveAmount } from "@/utils/schema";
import { todayLocal } from "@/utils/local-date";
import type { Cadence, IRecurringBill } from "@/utils/types";
import { CADENCE_LABELS } from "../utils";

const CATEGORY_OPTIONS = CATEGORIES.map((item) => ({ name: item, value: item }));
const CADENCES = Object.keys(CADENCE_LABELS) as [Cadence, ...Cadence[]];
const CADENCE_OPTIONS = CADENCES.map((cadence) => ({
  name: CADENCE_LABELS[cadence],
  value: cadence,
}));

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .max(40, { message: "Must be 40 characters or fewer" }),
  category: z.string().min(1, { message: "Required" }),
  amount: positiveAmount,
  cadence: z.enum(CADENCES, { errorMap: () => ({ message: "Required" }) }),
  // Today or later: a past date would generate a backlog of overdue bills.
  nextDueDate: z
    .date({ message: "Required" })
    .refine((date) => todayLocal(date) >= todayLocal(), {
      message: "Can't be in the past",
    }),
});

type FormValues = z.infer<typeof formSchema>;

const defaultsFor = (bill?: IRecurringBill): Partial<FormValues> => ({
  name: bill?.name ?? "",
  category: bill?.category ?? "",
  amount: bill ? String(bill.amount) : "",
  cadence: bill?.cadence,
  // Only used when adding. Editing hides the field (the schedule continues
  // from the latest due date), so it must still pass the "not in the past"
  // check: an existing bill's start date usually is in the past.
  nextDueDate: new Date(),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // When given, the form edits this bill.
  bill?: IRecurringBill;
};

const BillForm = ({ isOpen, onClose, bill }: Props) => {
  const addBill = useBoundStore((store) => store.addBill);
  const updateBill = useBoundStore((store) => store.updateBill);
  const generateDue = useBoundStore((store) => store.generateDue);
  const isEdit = Boolean(bill);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultsFor(bill),
  });
  const { reset } = form;

  useEffect(() => {
    reset(defaultsFor(bill));
  }, [bill, reset]);

  const handleClose = () => {
    reset(defaultsFor(bill));
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    const details = {
      name: values.name,
      category: values.category,
      amount: Number(values.amount),
      cadence: values.cadence,
    };

    if (bill) {
      updateBill(bill.id, details);
    } else {
      addBill({ ...details, anchorDate: todayLocal(values.nextDueDate) });
    }
    // Generation otherwise only re-runs on a new day: a bill due today should
    // show as due straight away.
    generateDue(todayLocal());
    handleClose();
  };

  return (
    <Modal
      title={isEdit ? "Edit Bill" : "Add New Bill"}
      description={
        isEdit
          ? "Changes apply from the next bill. Bills already due keep their amount."
          : "Add a bill that repeats. From its next due date, it shows as due each time until you mark it paid."
      }
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Bill Name"
            placeholder="e.g. Rent"
            control={form.control}
          />
          <FormSelect
            name="category"
            label="Category"
            placeholder="Select Category"
            control={form.control}
            options={CATEGORY_OPTIONS}
          />
          <FormInput
            name="amount"
            label="Amount"
            placeholder="e.g. 50"
            inputType="number"
            control={form.control}
          />
          <FormSelect
            name="cadence"
            label="Repeats"
            placeholder="Select how often"
            control={form.control}
            options={CADENCE_OPTIONS}
          />
          {isEdit ? (
            <Typography variant="preset-5" className="text-grey-500">
              The schedule continues from the bill&apos;s latest due date.
            </Typography>
          ) : (
            <DatePicker
              name="nextDueDate"
              label="Next Due Date"
              control={form.control}
              allowFuture
              disablePast
            />
          )}

          <Button className="w-full" size="xl" type="submit">
            {isEdit ? "Save Changes" : "Add Bill"}
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default BillForm;
