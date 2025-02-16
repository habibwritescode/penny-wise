import React, { useState } from "react";
import Sidebar from "../sidebar";
import BottomNav from "../bottom-nav";
import SidebarNavList from "../sidebar-nav-list";
import SidebarHeader from "../sidebar-header";
import SidebarFooter from "../sidebar-footer";

const transitionClasses = "transition-all duration-500 ease-in-out";

const Layout = ({ children }: { children: React.ReactElement }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="flex">
      <Sidebar
        isExpanded={isSidebarExpanded}
        transitionClasses={transitionClasses}
      >
        <SidebarHeader
          isExpanded={isSidebarExpanded}
          transitionClasses={transitionClasses}
        />
        <SidebarNavList
          isExpanded={isSidebarExpanded}
          transitionClasses={transitionClasses}
        />
        <SidebarFooter
          isExpanded={isSidebarExpanded}
          transitionClasses={transitionClasses}
          handleToggle={() => setIsSidebarExpanded((prev) => !prev)}
        />
      </Sidebar>
      <main
        className={`${isSidebarExpanded ? "md:ml-[300px]" : "md:ml-[88px]"} w-full min-h-screen p-4 sm:p-10 mb-[80px] transition-all duration-500 ease-in-out`}
      >
        <div className="max-w-[1140px]">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
};
export default Layout;
