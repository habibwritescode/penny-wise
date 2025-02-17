import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import Typography from "@/components/typography";
import { IBudget } from "@/utils/types";
import useBoundStore from "@/lib/store/store";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  budget: IBudget;
};

const DeleteBudget = ({ isOpen, onClose, budget }: Props) => {
  const deleteBudget = useBoundStore((store) => store.deleteBudget);

  const onSubmit = () => {
    deleteBudget(budget.category);
    onClose();
  };

  return (
    <Modal
      title={`Delete '${budget.category}'?`}
      description="Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever."
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
