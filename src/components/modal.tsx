import { useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import useMediaQuery from "@/lib/use-media-query";

type Props = {
  title: string;
  description?: string;
  children: React.ReactElement;
  isOpen: boolean;
  onClose: () => void;
};

const titleClass = "text-left text-[32px] font-bold leading-tight text-grey-900";
const descriptionClass = "text-left text-sm text-grey-500";

// A centred dialog, or on phones a bottom sheet: in thumb reach, and dismissed
// by dragging down. Forms are closed on load, so deciding in JS (false on the
// server) never flashes.
const Modal = ({ title, description, isOpen, onClose, children }: Props) => {
  const isPhoneNow = useMediaQuery("(max-width: 639px)");
  // Chosen when it opens and kept until it closes: switching between the two
  // remounts the fields, so rotating a phone would drop focus (closing the
  // keyboard) and replay the open animation.
  const openedAsPhone = useRef(isPhoneNow);
  if (!isOpen) openedAsPhone.current = isPhoneNow;
  const isPhone = openedAsPhone.current;

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (isPhone) {
    return (
      <Drawer open={isOpen} onOpenChange={onChange}>
        <DrawerContent>
          {/* Only this scrolls, so a tall form scrolls inside the sheet
              instead of dragging it. */}
          <div className="grid gap-4 overflow-y-auto overscroll-contain px-5 pt-4">
            <div className="space-y-1.5 pr-8">
              <DrawerTitle className={titleClass}>{title}</DrawerTitle>
              {description && (
                <DrawerDescription className={descriptionClass}>
                  {description}
                </DrawerDescription>
              )}
            </div>
            <div>{children}</div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-[335px] md:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className={titleClass}>{title}</DialogTitle>
          {description && (
            <DialogDescription className={descriptionClass}>
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
