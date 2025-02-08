import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PotsItem from "./components/pots-item";
import CreatePot from "./components/create-pot";
import useBoundStore from "@/lib/store/store";

const PotsPage = () => {
  const pots = useBoundStore((store) => store.pots);

  const [openModal, setOpenModal] = useState<"add-pot" | null>(null);

  const handleCloseModal = () => setOpenModal(null);

  return (
    <>
      <div className="pb-8">
        <div className="flex justify-between items-center mb-8">
          <Typography tag="h1">Pots</Typography>

          <Button
            className="rounded-[8px]"
            size="xl"
            onClick={() => setOpenModal("add-pot")}
          >
            <Typography
              tag="span"
              variant="preset-4-bold"
              className="text-white"
            >
              + Add New Pot
            </Typography>
          </Button>
        </div>

        <section className="grid grid-cols-2 gap-4">
          {pots.map((pot) => (
            <PotsItem key={pot.name} pot={pot} />
          ))}
        </section>
      </div>

      <CreatePot isOpen={openModal === "add-pot"} onClose={handleCloseModal} />
    </>
  );
};

export default PotsPage;
