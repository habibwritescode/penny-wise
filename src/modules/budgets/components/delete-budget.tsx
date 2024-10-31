import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "../../../components/modal";
import { Form } from "../../../components/ui/form";
import FormInput from "../../../components/form-input";
import FormSelect from "../../../components/form-select";
import { Button } from "../../../components/ui/button";
import { CATEGORIES, COLORS } from "@/utils/constants";
import data from "@/utils/data.json";
import Typography from "../../../components/typography";
import { IBudget } from "@/utils/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  budget: IBudget;
};

const DeleteBudget = ({ isOpen, onClose, budget }: Props) => {
  const onSubmit = () => {
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
          className="w-full bg-red"
          type="submit"
          variant="destructive"
          size="xl"
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
