import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />

        <main
          className="
            flex-1
            bg-gray-50
            p-6
            overflow-auto
          ">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
