import { cn } from "@/lib/utils";

type Props = {
  isExpanded: boolean;
  // setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  transitionClasses: string;
};

const Sidebar = ({ isExpanded, transitionClasses, children }: Props) => {
  return (
    <aside
      className={cn(
        "z-10 hidden md:block fixed bg-grey-900 h-screen rounded-r-[15px]",
        "pt-10 pr-6 pb-[76px]",
        isExpanded ? "w-[300px]" : "w-[88px]",
        transitionClasses
      )}
    >
      {children}
    </aside>
  );
};

export default Sidebar;
