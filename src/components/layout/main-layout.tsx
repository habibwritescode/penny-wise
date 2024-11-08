import React, { useState } from "react";
import Sidebar from "../sidebar";
import BottomNav from "../bottom-nav";

const Layout = ({ children }: { children: React.ReactElement }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="flex">
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />
      <main
        className={`${isSidebarExpanded ? "md:ml-[300px]" : "md:ml-[88px]"} w-full min-h-screen p-4 sm:p-10 pb-[80px] md:pb-0`}
      >
        <div className="max-w-[1140px]">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
