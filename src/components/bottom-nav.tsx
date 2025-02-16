import Link from "next/link";
import { useRouter } from "next/router";
import Typography from "./typography";
import { navItems } from "./sidebar-nav-list";

const BottomNav = () => {
  const router = useRouter();

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-grey-900 sm:h-[74px] h-[52px] px-4 pt-2 sm:px-10 rounded-t-[15px]">
      <ul className="flex justify-evenly h-full">
        {navItems.map((item) => {
          const isActive = router.asPath === item.route;

          return (
            <li
              key={item.title}
              className={`${isActive ? "bg-background border-b-green border-b-4" : "border-b-transparent"} group border-b-4 px-6 text-green cursor-pointer rounded-t-lg`}
            >
              <Link
                href={item.route}
                className="flex flex-col justify-center items-center w-full gap-1 h-full"
              >
                <item.icon
                  className={` ${isActive ? "text-green" : "text-[#B3B3B3] group-hover:text-grey-100"}`}
                />
                <Typography
                  variant="preset-3"
                  className={`hidden sm:block ${isActive ? "text-grey-900" : "text-grey-300 group-hover:text-grey-100"} transition-all ease-in-out `}
                >
                  {item.title}
                </Typography>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BottomNav;
