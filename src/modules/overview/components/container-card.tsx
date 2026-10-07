import Typography from "@/components/typography";
import Link from "next/link";
import { useId } from "react";

import CaretIcon from "../../../../public/assets/icons/caret-right.svg";

type IContainerCardProps = {
  title: string;
  linkTitle?: string;
  route: string;
  children: React.ReactElement;
};

const ContainerCard = ({
  title,
  linkTitle = "See Details",
  route,
  children,
}: IContainerCardProps) => {
  const headingId = useId();

  // A labelled region, so screen readers (and tests) can find each card by name.
  return (
    <section aria-labelledby={headingId} className="bg-white p-8 rounded-2xl">
      <div className="flex justify-between items-center">
        <Typography tag="h2" variant="preset-2" id={headingId}>
          {title}
        </Typography>

        <Link href={route} className="flex items-center gap-3">
          <Typography tag="span" variant="preset-4" className="text-grey-500">
            {linkTitle}
          </Typography>
          <CaretIcon className="text-[#696868]" />
        </Link>
      </div>

      {children}
    </section>
  );
};

export default ContainerCard;
