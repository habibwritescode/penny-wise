import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import Typography from "@/components/typography";
import { IBudget } from "@/utils/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  budget: IBudget;
  // The card animates out, deletes, and offers Undo.
  onConfirm: () => void;
};

const DeleteBudget = ({ isOpen, onClose, budget, onConfirm }: Props) => {
  const onSubmit = () => {
    onClose();
    onConfirm();
  };

  return (
    <Modal
      title={`Delete '${budget.category}'?`}
      description="This removes the budget. Your transactions in this category are kept. You can undo this straight afterwards."
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        <Button
          className="w-full bg-red mb-2"
          type="submit"
          variant="destructive"
          size="xl"
          onClick={onSubmit}
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

export default DeleteBudget;
