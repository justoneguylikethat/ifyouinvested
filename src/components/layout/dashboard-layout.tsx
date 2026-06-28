"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./topnav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220]">
      <Sidebar 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div 
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          collapsed ? "lg:pl-[80px]" : "lg:pl-[280px]"
        }`}
      >
        <TopNav setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-[#0B1220] to-emerald-900/10 -z-10 pointer-events-none" />
          {children}
        </main>
      </div>
    </div>
  );
}
