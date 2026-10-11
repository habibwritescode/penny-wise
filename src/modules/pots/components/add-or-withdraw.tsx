import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { positiveAmount } from "@/utils/schema";

const formSchema = z.object({
  amount: positiveAmount,
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

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = () => {
    if (newTotal < 0) {
      setError("amount", {
        type: "custom",
        message: `Can't withdraw more than ${currencyFormatter.format(pot.total)}`,
      });
      return;
    }

    const change = newTotal - pot.total;
    updatePotTotal(newTotal, pot.name);
    handleClose();

    // Undo applies the opposite change to the current total, so it stays
    // correct even if the pot changed again in the meantime.
    const undo = () => {
      const current = useBoundStore
        .getState()
        .pots.find((item) => item.name === pot.name);
      if (current) updatePotTotal(current.total - change, pot.name);
    };
    const amount = currencyFormatter.format(Math.abs(change));
    const reachedGoal = isAdd && pot.total < pot.target && newTotal >= pot.target;

    if (reachedGoal) {
      toast.success("Savings goal reached", {
        description: `${pot.name} hit its ${currencyFormatter.format(pot.target)} target.`,
        action: { label: "Undo", onClick: undo },
      });
    } else {
      toast.success(
        isAdd ? `Added ${amount} to ${pot.name}` : `Withdrew ${amount} from ${pot.name}`,
        { action: { label: "Undo", onClick: undo } }
      );
    }
  };

  return (
    <Modal
      title={`${isAdd ? "Add to" : "Withdraw from"} '${pot.name}'`}
      description={isAdd ? "Increase your pot amount." : "Withdraw from pot."}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <>
        {/* Wraps so a large amount drops below the label, never splitting. */}
        <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-1 mb-4">
          <Typography
            tag="p"
            variant="preset-4"
            className="shrink-0 text-grey-500"
          >
            New Amount
          </Typography>
          <Typography
            tag="p"
            variant="preset-1"
            className="ml-auto whitespace-nowrap"
          >
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
          <Typography
            tag="p"
            variant="preset-5"
            className={isAdd ? "text-green" : "text-red"}
          >
            {Math.abs(newPercent).toFixed(2)}%
          </Typography>
          <Typography tag="p" variant="preset-5" className="text-grey-500">
            Target of {currencyFormatter.format(pot.target)}
          </Typography>
        </div>

        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
