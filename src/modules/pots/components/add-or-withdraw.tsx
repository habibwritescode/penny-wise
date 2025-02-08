import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/modal";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import Typography from "@/components/typography";
import { IPot } from "@/utils/types";
import currencyFormatter from "@/utils/formatCurrency";
import MultiPartProgressBar from "@/components/multi-part-progress";
import { calculatePercent } from "@/utils/math";
import useBoundStore from "@/lib/store/store";

const formSchema = z.object({
  amount: z.string().min(1, { message: "Required" }),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pot: IPot;
  isAdd: boolean;
};

const AddOrWitdrawPot = ({ pot, isOpen, onClose, isAdd }: Props) => {
  const updatePotTotal = useBoundStore((store) => store.updatePotTotal);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });
  const { watch, reset, setError } = form;

  const amountInput = watch("amount");
  const newTotal = isAdd
    ? pot.total + Number(amountInput || 0)
    : pot.total - Number(amountInput || 0);
  const newPercent = calculatePercent(newTotal, pot.target);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (newTotal < 0) {
      setError("amount", {
        type: "custom",
        message: "Can't withdraw more than " + pot.total,
      });
      return;
    }

    updatePotTotal(newTotal, pot.name);

    reset();
    onClose();
  };

  return (
    <Modal
      title={`${isAdd ? "Add to" : "Withdraw from"} '${pot.name}'`}
      description={isAdd ? "Increase your pot amount." : "Withdraw from pot."}
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        <div className="flex justify-between items-center mb-4">
          <Typography tag="p" variant="preset-4" className="text-grey-500">
            New Amount
          </Typography>
          <Typography tag="p" variant="preset-1">
            {currencyFormatter.format(newTotal)}
          </Typography>
        </div>

        <div className="relative">
          <MultiPartProgressBar
            target={pot.target}
            current={isAdd ? pot.total : newTotal}
            change={Number(amountInput || 0)}
            changeColor={isAdd ? "#277C78" : "#C94736"}
          />
        </div>

        <div className="flex justify-between items-center mt-3 mb-7">
          <Typography tag="p" variant="preset-5" className="text-red">
            {Math.abs(newPercent).toFixed(2)}%
          </Typography>
          <Typography tag="p" variant="preset-5" className="text-grey-500">
            Target of {currencyFormatter.format(pot.target)}
          </Typography>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="amount"
              label={`Amount to ${isAdd ? "Add" : "Withdraw"}`}
              inputType="number"
              placeholder="e.g. 20"
              control={form.control}
            />

            <Button className="w-full" size="xl" type="submit">
              Confirm {isAdd ? "Addition" : "Withdrawal"}
            </Button>
          </form>
        </Form>
      </>
    </Modal>
  );
};

export default AddOrWitdrawPot;
