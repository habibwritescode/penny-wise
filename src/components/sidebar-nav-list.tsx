import Link from "next/link";
import { useRouter } from "next/router";

import HomeIcon from "../../public/assets/icons/home.svg";
import TransactionsIcon from "../../public/assets/icons/transactions.svg";
import BudgetsIcon from "../../public/assets/icons/budgets.svg";
import PotsIcon from "../../public/assets/icons/pots.svg";
import RecurringIcon from "../../public/assets/icons/recurring.svg";
import Typography from "./typography";

import { cn } from "@/lib/utils";
import { SIDEBAR_COLLAPSE } from "@/utils/constants";

export const navItems = [
  { title: "Overview", route: "/", icon: HomeIcon },
  { title: "Transactions", route: "/transactions", icon: TransactionsIcon },
  { title: "Budgets", route: "/budgets", icon: BudgetsIcon },
  { title: "Pots", route: "/pots", icon: PotsIcon },
  { title: "Recurring Bills", route: "/recurring-bills", icon: RecurringIcon },
];

interface Props {
  isExpanded: boolean;
}

const SidebarNavList = ({ isExpanded }: Props) => {
  const router = useRouter();

  return (
    <ul className="mt-16 h-full overflow-y-auto overscroll-contain">
      {navItems.map((item) => {
        const isActive = router.asPath === item.route;

        return (
          <li
            key={item.title}
            className={cn(
              "group border-l-4 text-green flex h-14 cursor-pointer rounded-r-lg overflow-hidden",
              isActive
                ? "bg-background border-l-green"
                : "border-l-transparent",
              // Collapsed, 20px centres the icon in the 64px pill.
              isExpanded ? "pl-9" : "pl-5",
              SIDEBAR_COLLAPSE
            )}
          >
            <Link
              href={item.route}
              className="flex items-center gap-5 w-full"
            >
              {/* Neither shrinks: in the narrow sidebar the label overflows
                  and is clipped, instead of squeezing the icon to nothing. */}
              <item.icon
                className={cn(
                  "shrink-0",
                  isActive
                    ? "text-green"
                    : "text-[#B3B3B3] group-hover:text-grey-100",
                  "transition-colors duration-150"
                )}
              />
              <Typography
                variant="preset-3"
                data-hidden={!isExpanded}
                className={cn(
                  "shrink-0 whitespace-nowrap sidebar-fade",
                  isActive
                    ? "text-grey-900"
                    : "text-grey-500 group-hover:text-grey-100"
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
