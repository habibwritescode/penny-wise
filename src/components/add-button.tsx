import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";

type Props = {
  // Full label, e.g. "Add Transaction". Shown from sm up and always used as
  // the accessible name.
  label: string;
  onClick: () => void;
};

// Page-header "+ Add …" button. On phones the long label wouldn't fit beside
// the page title, so it shows just "+ Add" (still contained in the accessible
// name, as label-in-name requires).
const AddButton = ({ label, onClick }: Props) => (
  <Button
    className="rounded-[8px]"
    size="xl"
    onClick={onClick}
    aria-label={label}
  >
    <Typography tag="span" variant="preset-4-bold" className="text-white">
      <span aria-hidden="true">+ </span>
      <span className="sm:hidden">Add</span>
      <span className="hidden sm:inline">{label}</span>
    </Typography>
  </Button>
);

export default AddButton;
