import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  title: string;
  description?: string;
  children: React.ReactElement;
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({ title, description, isOpen, onClose, children }: Props) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-[335px] md:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="text-left text-[32px] font-bold leading-tight text-grey-900">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-left text-grey-500">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
