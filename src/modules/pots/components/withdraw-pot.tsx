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
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  amount: z.string().min(1, { message: "Required" }),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pot: IPot;
};

const WithdrawPot = ({ pot, isOpen, onClose }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
    onClose();
  };

  return (
    <Modal
      title={`Withdraw from '${pot.name}'`}
      description="Withdraw for special purchases."
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        <div className="flex justify-between items-center mb-4">
          <Typography tag="p" variant="preset-4" className="text-grey-500">
            New Amount
          </Typography>
          <Typography tag="p" variant="preset-1">
            {currencyFormatter.format(pot.total)}
          </Typography>
        </div>

        <Progress
          value={40}
          color={pot.theme}
          className="h-2 rounded-[4px] bg-beige-100"
        />

        <div className="flex justify-between items-center mt-3 mb-7">
          <Typography tag="p" variant="preset-5" className="text-red">
            30%
          </Typography>
          <Typography tag="p" variant="preset-5" className="text-grey-500">
            Target of {currencyFormatter.format(pot.target)}
          </Typography>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="amount"
              label="Amount to Withdraw"
              placeholder="e.g. 20"
              control={form.control}
            />

            <Button className="w-full" size="xl" type="submit">
              Confirm Withdrawal
            </Button>
          </form>
        </Form>
      </>
    </Modal>
  );
};

export default WithdrawPot;
