import Typography from "@/components/typography";
import Link from "next/link";

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
  return (
    <div className="bg-white p-8 rounded-2xl">
      <div className="flex justify-between items-center">
        <Typography tag="h2" variant="preset-2">
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
    </div>
  );
};

export default ContainerCard;
