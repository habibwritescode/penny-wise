import React, { useState } from "react";
import Sidebar from "../sidebar";
import BottomNav from "../bottom-nav";
import SidebarNavList from "../sidebar-nav-list";
import SidebarHeader from "../sidebar-header";
import SidebarFooter from "../sidebar-footer";
import { cn } from "@/lib/utils";
import { SIDEBAR_COLLAPSE } from "@/utils/constants";
import useAuthRedirect from "@/lib/store/use-auth-redirect";
import useBillGeneration from "@/lib/store/use-bill-generation";
import PageSkeleton from "../page-skeleton";

const Layout = ({ children }: { children: React.ReactElement }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  // The shell renders immediately (including on the server); only the page
  // content waits for persisted data, so first load shows a skeleton.
  const isReady = useAuthRedirect("protected");
  useBillGeneration();

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
      {/* Offsets match the sidebar (lg+) and bottom nav (below lg). */}
      <main
        className={cn(
          // dvh tracks the visible area as mobile browser chrome shows/hides
          // (100vh where dvh isn't supported);
          // the bottom margin and top padding clear the bottom nav, home
          // indicator and (when installed) status bar.
          "w-full min-h-screen supports-[min-height:100dvh]:min-h-dvh p-4 sm:p-10 pt-[max(1rem,env(safe-area-inset-top,0px))] sm:pt-[max(2.5rem,env(safe-area-inset-top,0px))] mb-[calc(80px+env(safe-area-inset-bottom,0px))] lg:mb-0",
          isSidebarExpanded ? "lg:ml-[300px]" : "lg:ml-[88px]",
          SIDEBAR_COLLAPSE
        )}
      >
        <div className="max-w-[1140px]">
          {isReady ? (
            <div className="motion-safe:animate-in motion-safe:fade-in duration-200 ease-out-strong">
              {children}
            </div>
          ) : (
            <PageSkeleton />
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
