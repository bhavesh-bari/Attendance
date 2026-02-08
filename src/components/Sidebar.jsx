"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  BookOpen,
  Table,
  BarChart3,
  LogOut,
  User,
} from "lucide-react";

const SIDEBAR_WIDTH_FULL = "w-64";
const SIDEBAR_WIDTH_COLLAPSED = "w-20";
const DURATION = "duration-300";

const navItemsByRole = {
  AMC: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Attendance Fill", href: "/attendances", icon: BookOpen },
    { name: "Classes Management", href: "/classes", icon: Users },
    { name: "Table", href: "/table", icon: Table },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ],
  "Department Dean": [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Attendance Fill", href: "/attendances", icon: BookOpen },
    { name: "Table", href: "/table", icon: Table },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ],
  Faculty: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Table", href: "/table", icon: Table },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ],
};

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const { name, email, role } = session.user;
  const navItems = navItemsByRole[role] || [];

  return (
    <aside
      className={`
        fixed top-16 bottom-0 left-0 z-50
        flex flex-col
        bg-slate-950/90 backdrop-blur-xl
        border-r border-white/10
        transition-all ${DURATION} cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_COLLAPSED}
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* NAVIGATION SECTION */}
      <nav className="flex flex-col p-3 space-y-2 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={`
                group relative flex items-center px-3 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? "bg-cyan-500/15 text-cyan-400 border-l-4 border-cyan-500"
                  : "text-slate-400 hover:bg-white/5 hover:text-cyan-300"}
              `}
            >
              {/* Icon */}
              <item.icon
                className={`w-5 h-5 transition-transform duration-200 
                ${isSidebarOpen ? "mr-3" : "mx-auto"} 
                ${isActive ? "text-cyan-400 scale-110" : "group-hover:scale-110"}`}
              />

              {/* Text Label */}
              <span
                className={`
                  font-medium text-sm whitespace-nowrap transition-all duration-300
                  ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 w-0 -translate-x-2"}
                `}
              >
                {item.name}
              </span>

              {/* Tooltip (Only when collapsed & Desktop) */}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-cyan-600 text-white text-xs font-bold rounded-lg 
                                opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 
                                transition-all duration-200 pointer-events-none hidden md:block whitespace-nowrap shadow-2xl z-[60]">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* PROFILE & LOGOUT SECTION */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        {isSidebarOpen && (
          <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-cyan-500/20">
              <User size={18} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-xs font-bold text-slate-100 truncate">{name}</p>
              <p className="text-[10px] text-cyan-400/80 font-medium truncate uppercase tracking-wider">{role}</p>
              <p className="text-[10px] text-gray-500 font-medium truncate">{email}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/auth" })}
          className={`
            group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
            bg-rose-500/10 border border-rose-500/20 text-rose-400 
            hover:bg-rose-500 hover:text-white transition-all duration-200 
            shadow-sm active:scale-95
            ${!isSidebarOpen && "justify-center"}
          `}
        >
          <LogOut className={`w-4 h-4 transition-transform group-hover:rotate-12`} />
          {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>}

          {!isSidebarOpen && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg 
             opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}