import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Typography from "./typography";

import HomeIcon from "../../public/assets/icons/home.svg";
import TransactionsIcon from "../../public/assets/icons/transactions.svg";
import BudgetsIcon from "../../public/assets/icons/budgets.svg";
import PotsIcon from "../../public/assets/icons/pots.svg";
import RecurringIcon from "../../public/assets/icons/recurring.svg";
import ArrowIcon from "../../public/assets/icons/arrow-minimize.svg";

export const navItems = [
  {
    title: "Overview",
    route: "/",
    icon: HomeIcon,
  },
  {
    title: "Transactions",
    route: "/transactions",
    icon: TransactionsIcon,
  },
  {
    title: "Budgets",
    route: "/budgets",
    icon: BudgetsIcon,
  },
  {
    title: "Pots",
    route: "/pots",
    icon: PotsIcon,
  },
  {
    title: "Recurring Bills",
    route: "/recurring-bills",
    icon: RecurringIcon,
  },
];

type Props = {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ isExpanded, setIsExpanded }: Props) => {
  const router = useRouter();

  return (
    <aside
      className={`${isExpanded ? "w-[300px]" : "w-[88px]"} hidden md:block fixed bg-grey-900 h-screen rounded-r-[15px] pt-10 pr-6 pb-[76px]`}
    >
      <div
        className={` ${isExpanded ? "ml-9" : "justify-center"} grid items-center h-6`}
      >
        <Image
          className={`transition-all ${!isExpanded ? "hidden" : ""} `}
          src="/logo-full.svg"
          alt="logo"
          width={121.45}
          height={21.76}
          priority
        />
        <Image
          className={`transition-all ${isExpanded ? "hidden" : ""} `}
          src="/logo-min.svg"
          alt="logo"
          width={12.48}
          height={21.76}
          priority
        />
      </div>

      <ul className="mt-16 h-full overflow-y-auto">
        {navItems.map((item) => {
          const isActive = router.asPath === item.route;

          return (
            <li
              key={item.title}
              className={`${isActive ? "bg-background border-l-green border-l-4" : "border-l-transparent"} group border-l-4 text-green flex ${isExpanded ? "pl-9" : "justify-center"} h-14 cursor-pointer rounded-r-lg`}
            >
              <Link href={item.route} className="flex items-center gap-5">
                <item.icon
                  className={` ${isActive ? "text-green" : "text-[#B3B3B3] group-hover:text-grey-100"}`}
                />
                <Typography
                  variant="preset-3"
                  className={`${isActive ? "text-grey-900" : "text-grey-300 group-hover:text-grey-100"} transition-all ease-in-out ${!isExpanded ? "hidden" : ""} `}
                >
                  {item.title}
                </Typography>
              </Link>
            </li>
          );
        })}
      </ul>

      <div
        className="absolute bottom-20 cursor-pointer w-full group"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div
          className={`flex ${isExpanded ? "pl-9" : "justify-center"}  items-center gap-4`}
        >
          <ArrowIcon
            className={`${isExpanded ? "" : "rotate-180 animate-in"} text-[#B3B3B3] group-hover:text-grey-100`}
          />
          {isExpanded && (
            <Typography
              variant="preset-3"
              className="text-grey-300 group-hover:text-grey-100"
            >
              Minimize Menu
            </Typography>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
