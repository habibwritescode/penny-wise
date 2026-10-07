import { useState } from "react";

import ActionDropdown from "@/components/action-dropdown";
import type { IRecurringBill } from "@/utils/types";
import BillForm from "./bill-form";
import DeleteBill from "./delete-bill";

// Row menu for a bill: edit or delete, each in its own dialog.
const BillActions = ({ bill }: { bill: IRecurringBill }) => {
  const [openModal, setOpenModal] = useState<"edit" | "delete" | null>(null);
  const close = () => setOpenModal(null);

  return (
    <>
      <ActionDropdown
        label={`Actions for ${bill.name}`}
        items={[
          { name: "Edit Bill", onSelect: () => setOpenModal("edit") },
          {
            name: "Delete Bill",
            onSelect: () => setOpenModal("delete"),
            className: "text-red hover:text-red focus:text-red",
          },
        ]}
      />
      <BillForm isOpen={openModal === "edit"} onClose={close} bill={bill} />
      <DeleteBill isOpen={openModal === "delete"} onClose={close} bill={bill} />
    </>
  );
};

export default BillActions;
