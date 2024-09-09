import React from "react";
import Sidebar from "./sidebar";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full min-h-screen p-10">
        <div className="max-w-[1140px]">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
