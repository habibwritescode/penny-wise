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
// Pressing a tab scales it slightly (dims instead with reduced motion), so the tap feels acknowledged.
const contentClass =
  "flex flex-col justify-center items-center w-full gap-1 h-full transition-transform duration-150 ease-out-strong active:scale-[0.97] motion-reduce:active:scale-100 motion-reduce:active:opacity-70";
const labelClass = "hidden sm:block whitespace-nowrap";

// Shown below lg; keep in sync with sidebar.tsx (lg:block) and the
// lg:ml-* / lg:mb-0 offsets in layout/main-layout.tsx.
const BottomNav = () => {
  const router = useRouter();
  const signOut = useBoundStore((store) => store.signOut);

  return (
    // Height and bottom padding grow by the home-indicator inset, so the tabs
    // sit above it while the bar's background reaches the screen edge.
    <div className="lg:hidden fixed bottom-0 w-full bg-grey-900 h-[calc(52px+env(safe-area-inset-bottom,0px))] sm:h-[calc(74px+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] pt-2 pl-[calc(1rem+env(safe-area-inset-left,0px))] pr-[calc(1rem+env(safe-area-inset-right,0px))] sm:pl-[calc(2.5rem+env(safe-area-inset-left,0px))] sm:pr-[calc(2.5rem+env(safe-area-inset-right,0px))] rounded-t-[15px]">
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
              {/* Labels are hidden on phones, so the link needs its own name. */}
              <Link
                href={item.route}
                aria-label={item.title}
                aria-current={isActive ? "page" : undefined}
                className={contentClass}
              >
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
