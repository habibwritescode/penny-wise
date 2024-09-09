import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Typography from "./typography";

import HomeIcon from "../../public/icons/home.svg";
import TransactionsIcon from "../../public/icons/transactions.svg";
import BudgetsIcon from "../../public/icons/budgets.svg";
import PotsIcon from "../../public/icons/pots.svg";
import RecurringIcon from "../../public/icons/recurring.svg";
import ArrowIcon from "../../public/icons/arrow-minimize.svg";

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

const Sidebar = () => {
  const router = useRouter();
  const [isFull, setIsFull] = useState(true);

  return (
    <aside
      className={`${isFull ? "w-[300px]" : "w-[88px]"} relative tranition ease-in-out animate-in bg-grey-900 h-screen rounded-r-[15px]  pt-10 pr-6 pb-[76px]`}
    >
      <div
        className={` ${isFull ? "ml-9" : "justify-center"} grid items-center h-6`}
      >
        <Image
          className={`transition-all ${!isFull ? "hidden" : ""} `}
          src="/logo-full.svg"
          alt="logo"
          width={121.45}
          height={21.76}
          priority
        />
        <Image
          className={`transition-all ${isFull ? "hidden" : ""} `}
          src="/logo-min.svg"
          alt="logo"
          width={12.48}
          height={21.76}
          priority
        />
      </div>

      <ul className="mt-16">
        {navItems.map((item) => {
          const isActive = router.asPath === item.route;

          return (
            <li
              key={item.title}
              className={`${isActive ? "bg-background border-l-green border-l-4" : "border-l-transparent"} group border-l-4 text-green flex ${isFull ? "pl-9" : "justify-center"} h-14 cursor-pointer rounded-r-lg`}
            >
              <Link href={item.route} className="flex items-center gap-5">
                <item.icon
                  className={` ${isActive ? "text-green" : "text-[#B3B3B3] group-hover:text-grey-100"}`}
                />
                <Typography
                  preset="preset-3"
                  className={`${isActive ? "text-grey-900" : "text-grey-300 group-hover:text-grey-100"} transition-all ease-in-out ${!isFull ? "hidden" : ""} `}
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
        onClick={() => setIsFull((prev) => !prev)}
      >
        <div
          className={`flex ${isFull ? "pl-9" : "justify-center"}  items-center gap-4`}
        >
          <ArrowIcon
            className={`${isFull ? "" : "rotate-180 animate-in"} text-[#B3B3B3] group-hover:text-grey-100`}
          />
          {isFull && (
            <Typography
              preset="preset-3"
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
