import React, { useState } from "react";
import Sidebar from "../sidebar";
import BottomNav from "../bottom-nav";
import SidebarNavList from "../sidebar-nav-list";
import SidebarHeader from "../sidebar-header";
import SidebarFooter from "../sidebar-footer";
import { cn } from "@/lib/utils";
import { SIDEBAR_TRANSITION } from "@/utils/constants";

const Layout = ({ children }: { children: React.ReactElement }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="flex">
      <Sidebar isExpanded={isSidebarExpanded}>
        <SidebarHeader isExpanded={isSidebarExpanded} />
        <SidebarNavList isExpanded={isSidebarExpanded} />
        <SidebarFooter
          isExpanded={isSidebarExpanded}
          handleToggle={() => setIsSidebarExpanded((prev) => !prev)}
        />
      </Sidebar>
      <main
        className={cn(
          "w-full min-h-screen p-4 sm:p-10 mb-[80px]",
          isSidebarExpanded ? "md:ml-[300px]" : "md:ml-[88px]",
          SIDEBAR_TRANSITION
        )}
      >
        <div className="max-w-[1140px]">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
