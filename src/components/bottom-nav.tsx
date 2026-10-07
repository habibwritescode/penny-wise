import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";
import Typography from "./typography";
import { cn } from "@/lib/utils";
import { navItems } from "./sidebar-nav-list";
import useBoundStore from "@/lib/store/store";

// Equal-width tabs so all six fit at every width; labels never wrap.
const itemClass =
  "group flex-1 min-w-0 border-b-4 rounded-t-lg cursor-pointer";
const contentClass =
  "flex flex-col justify-center items-center w-full gap-1 h-full";
const labelClass = "hidden sm:block whitespace-nowrap";

// Shown below lg; keep in sync with sidebar.tsx (lg:block) and the
// lg:ml-* / lg:mb-0 offsets in layout/main-layout.tsx.
const BottomNav = () => {
  const router = useRouter();
  const signOut = useBoundStore((store) => store.signOut);

  return (
    <div className="lg:hidden fixed bottom-0 w-full bg-grey-900 sm:h-[74px] h-[52px] px-4 pt-2 sm:px-10 rounded-t-[15px]">
      <ul className="flex h-full">
        {navItems.map((item) => {
          const isActive = router.asPath === item.route;

          return (
            <li
              key={item.title}
              className={cn(
                itemClass,
                isActive ? "bg-background border-b-green" : "border-b-transparent"
              )}
            >
              <Link href={item.route} className={contentClass}>
                <item.icon
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "text-green"
                      : "text-[#B3B3B3] group-hover:text-grey-100"
                  )}
                />
                <Typography
                  variant="preset-5-bold"
                  className={cn(
                    labelClass,
                    isActive
                      ? "text-grey-900"
                      : "text-grey-300 group-hover:text-grey-100"
                  )}
                >
                  {item.title}
                </Typography>
              </Link>
            </li>
          );
        })}

        <li className={cn(itemClass, "border-b-transparent")}>
          <button
            type="button"
            onClick={signOut}
            aria-label="Log Out"
            className={contentClass}
          >
            <LogOut className="h-5 w-5 shrink-0 text-[#B3B3B3] group-hover:text-grey-100" />
            <Typography
              variant="preset-5-bold"
              className={cn(labelClass, "text-grey-300 group-hover:text-grey-100")}
            >
              Log Out
            </Typography>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default BottomNav;
