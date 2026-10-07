import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import Typography from "@/components/typography";
import useBoundStore from "@/lib/store/store";
import type { IRecurringBill } from "@/utils/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  bill: IRecurringBill;
};

const DeleteBill = ({ isOpen, onClose, bill }: Props) => {
  const deleteBill = useBoundStore((store) => store.deleteBill);

  const onConfirm = () => {
    deleteBill(bill.id);
    onClose();
  };

  return (
    <Modal
      title={`Delete '${bill.name}'?`}
      description="This stops the bill repeating and removes any unpaid due dates. Bills you've already paid stay in your transactions."
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        <Button
          className="w-full bg-red mb-2"
          variant="destructive"
          size="xl"
          onClick={onConfirm}
        >
          <Typography variant="preset-4-bold" className="text-white">
            Yes, Confirm Deletion
          </Typography>
        </Button>
        <Button
          className="w-full"
          type="button"
          variant="ghost"
          size="xl"
          onClick={onClose}
        >
          <Typography variant="preset-4" className="text-grey-500">
            No, Go Back
          </Typography>
        </Button>
      </>
    </Modal>
  );
};

export default DeleteBill;
