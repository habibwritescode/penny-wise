import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import Typography from "@/components/typography";
import { IPot } from "@/utils/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pot: IPot;
};

const DeletePot = ({ isOpen, onClose, pot }: Props) => {
  const onSubmit = () => {
    onClose();
  };

  return (
    <Modal
      title={`Delete '${pot.name}'?`}
      description="Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever."
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

export default DeletePot;
