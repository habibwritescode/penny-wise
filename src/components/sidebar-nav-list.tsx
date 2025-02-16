import Link from "next/link";
import { useRouter } from "next/router";

import HomeIcon from "../../public/assets/icons/home.svg";
import TransactionsIcon from "../../public/assets/icons/transactions.svg";
import BudgetsIcon from "../../public/assets/icons/budgets.svg";
import PotsIcon from "../../public/assets/icons/pots.svg";
import RecurringIcon from "../../public/assets/icons/recurring.svg";
import Typography from "./typography";

import { cn } from "@/lib/utils";

export const navItems = [
  { title: "Overview", route: "/", icon: HomeIcon },
  { title: "Transactions", route: "/transactions", icon: TransactionsIcon },
  { title: "Budgets", route: "/budgets", icon: BudgetsIcon },
  { title: "Pots", route: "/pots", icon: PotsIcon },
  { title: "Recurring Bills", route: "/recurring-bills", icon: RecurringIcon },
];

interface Props {
  isExpanded: boolean;
  transitionClasses: string;
}

const SidebarNavList = ({ isExpanded, transitionClasses }: Props) => {
  const router = useRouter();

  return (
    <ul className="mt-16 h-full overflow-y-auto">
      {navItems.map((item) => {
        const isActive = router.asPath === item.route;

        return (
          <li
            key={item.title}
            className={cn(
              "group border-l-4 text-green flex h-14 cursor-pointer rounded-r-lg",
              isActive
                ? "bg-background border-l-green"
                : "border-l-transparent",
              isExpanded ? "pl-9" : "pl-3",
              transitionClasses
            )}
          >
            <Link
              href={item.route}
              className={cn(
                "flex items-center w-full",
                isExpanded ? "gap-5" : "justify-center",
                transitionClasses
              )}
            >
              <item.icon
                className={cn(
                  isActive
                    ? "text-green"
                    : "text-[#B3B3B3] group-hover:text-grey-100",
                  transitionClasses
                )}
              />
              <Typography
                variant="preset-3"
                className={cn(
                  "overflow-hidden",
                  isExpanded
                    ? "opacity-100 max-w-[200px]"
                    : "opacity-0 max-w-0",
                  isActive
                    ? "text-grey-900"
                    : "text-grey-500 group-hover:text-grey-100",
                  transitionClasses
                )}
              >
                {item.title}
              </Typography>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarNavList;
