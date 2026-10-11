import Link from "next/link";
import { useRouter } from "next/router";

import HomeIcon from "../../public/assets/icons/home.svg";
import TransactionsIcon from "../../public/assets/icons/transactions.svg";
import BudgetsIcon from "../../public/assets/icons/budgets.svg";
import PotsIcon from "../../public/assets/icons/pots.svg";
import RecurringIcon from "../../public/assets/icons/recurring.svg";
import Typography from "./typography";
import SidebarTooltip from "./sidebar-tooltip";

import { cn } from "@/lib/utils";
import { SIDEBAR_COLLAPSE } from "@/utils/constants";
import { hiddenWhenCollapsed, type SidebarMode } from "./sidebar-mode";

export const navItems = [
  { title: "Overview", route: "/", icon: HomeIcon },
  { title: "Transactions", route: "/transactions", icon: TransactionsIcon },
  { title: "Budgets", route: "/budgets", icon: BudgetsIcon },
  { title: "Pots", route: "/pots", icon: PotsIcon },
  { title: "Recurring Bills", route: "/recurring-bills", icon: RecurringIcon },
];

interface Props {
  mode: SidebarMode;
  // The effective state, for the collapsed sidebar's tooltips.
  isExpanded: boolean;
}

const SidebarNavList = ({ mode, isExpanded }: Props) => {
  const router = useRouter();

  return (
    <ul className="mt-16 h-full overflow-y-auto overscroll-contain">
      {navItems.map((item) => {
        const isActive = router.pathname === item.route;

        return (
          <li
            key={item.title}
            className={cn(
              "group border-l-4 text-green flex h-14 cursor-pointer rounded-r-lg overflow-hidden",
              isActive
                ? "bg-background border-l-green"
                : "border-l-transparent",
              // Collapsed, 20px centres the icon in the 64px pill.
              {
                auto: "pl-5 xl:pl-9",
                expanded: "pl-9",
                collapsed: "pl-5",
              }[mode],
              SIDEBAR_COLLAPSE,
            )}
          >
            <SidebarTooltip label={item.title} isExpanded={isExpanded}>
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
                    "transition-colors duration-150",
                  )}
                />
                <Typography
                  variant="preset-3"
                  data-hidden={hiddenWhenCollapsed(mode)}
                  className={cn(
                    "shrink-0 whitespace-nowrap sidebar-fade",
                    isActive
                      ? "text-grey-900"
                      : "text-grey-500 group-hover:text-grey-100",
                  )}
                >
                  {item.title}
                </Typography>
              </Link>
            </SidebarTooltip>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarNavList;
