import { useId, useState } from "react";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";

import Typography from "@/components/typography";
import currencyFormatter from "@/utils/formatCurrency";
import { IPot } from "@/utils/types";

import ActionDropdown from "@/components/action-dropdown";
import DeletePot from "./delete-pot";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { calculatePercent } from "@/utils/math";
import AddOrWitdrawPot from "./add-or-withdraw";
import CreatePot from "./create-pot";
import useBoundStore from "@/lib/store/store";
import useNewSinceMount from "@/lib/use-new-since-mount";
import { LEAVE_MS, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  pot: IPot;
  // Created during this visit: animate in (never on page load).
  isNew?: boolean;
};

type ModalType = "delete" | "edit" | "withdraw" | "add" | null;

const PotsItem = ({ pot, isNew = false }: Props) => {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const headingId = useId();
  const deletePot = useBoundStore((store) => store.deletePot);
  const restorePot = useBoundStore((store) => store.restorePot);

  const progressPercent = calculatePercent(pot.total, pot.target);
  const isGoalReached = pot.target > 0 && pot.total >= pot.target;
  // The badge pops in only when the goal is reached during this visit.
  const isNewBadge = useNewSinceMount(isGoalReached ? ["goal"] : []);

  // Fade the card out, then delete it, with Undo putting it back in place.
  const handleDelete = () => {
    const index = useBoundStore
      .getState()
      .pots.findIndex((item) => item.name === pot.name);
    const remove = () => {
      deletePot(pot.name);
      toast(`${pot.name} deleted`, {
        action: { label: "Undo", onClick: () => restorePot(pot, index) },
      });
    };

    if (prefersReducedMotion()) return remove();
    setIsLeaving(true);
    window.setTimeout(remove, LEAVE_MS);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <>
      <article
        aria-labelledby={headingId}
        className={cn(
          "bg-white rounded-xl px-6 pt-[28px] pb-[38px]",
          isNew && "enter-fade-scale",
          isLeaving && "leave-fade-scale"
        )}
      >
        <div className="flex items-center justify-between mb-6 w-full">
          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center min-w-0">
            <div
              className="w-4 h-4 rounded-full bg-green"
              style={{ backgroundColor: pot.theme }}
            />
            <Typography tag="h3" variant="preset-2" id={headingId}>
              {pot.name}
            </Typography>
            {isGoalReached && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-xs font-bold text-green whitespace-nowrap",
                  isNewBadge("goal") && "enter-pop"
                )}
              >
                <CircleCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Goal reached
              </span>
            )}
          </div>
          <ActionDropdown
            items={[
              {
                name: "Edit Pot",
                onSelect: () => setOpenModal("edit"),
              },
              {
                name: "Delete Pot",
                onSelect: () => setOpenModal("delete"),
                className: "text-red hover:text-red focus:text-red",
              },
            ]}
          />
        </div>

        <div className="flex justify-between items-center gap-4 mb-4">
          <Typography
            tag="p"
            variant="preset-4"
            className="shrink-0 text-grey-500"
          >
            Total Saved
          </Typography>
          <Typography
            tag="p"
            variant="preset-1"
            className="min-w-0 break-all text-right"
          >
            {currencyFormatter.format(pot.total || 0)}
          </Typography>
        </div>

        <Progress
          value={progressPercent}
          color={pot.theme}
          className="h-2 rounded-[4px] bg-beige-100"
        />

        <div className="flex justify-between items-center mt-3 mb-10">
          <Typography tag="p" variant="preset-5" className="text-grey-500">
            {progressPercent.toFixed(2)}%
          </Typography>
          <Typography tag="p" variant="preset-5" className="text-grey-500">
            Target of {currencyFormatter.format(pot.target)}
          </Typography>
        </div>

        <div className="grid gap-4 grid-cols-2">
          <Button
            variant="ghost"
            size="xl"
            className="bg-beige-100 text-grey-900"
            onClick={() => setOpenModal("add")}
          >
            + Add Money
          </Button>

          <Button
            variant="ghost"
            size="xl"
            className="bg-beige-100 text-grey-900"
            onClick={() => setOpenModal("withdraw")}
          >
            Withdraw
          </Button>
        </div>
      </article>

      <DeletePot
        pot={pot}
        isOpen={openModal === "delete"}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
      />

      <AddOrWitdrawPot
        pot={pot}
        isOpen={openModal === "withdraw" || openModal === "add"}
        onClose={handleCloseModal}
        isAdd={openModal === "add"}
      />

      <CreatePot
        isEdit
        pot={pot}
        isOpen={openModal === "edit"}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PotsItem;
