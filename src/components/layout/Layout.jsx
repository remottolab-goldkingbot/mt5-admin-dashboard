import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 font-sans grid-bg flex flex-col">
      <Topbar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex-1 flex flex-row max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
