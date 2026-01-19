"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  BookOpen,
  Table,
  BarChart3,
  LogOut,
  User,
} from "lucide-react";

const SIDEBAR_WIDTH_FULL = "w-48";
const SIDEBAR_WIDTH_COLLAPSED = "w-18";
const DURATION = "duration-300";

const navItemsByRole = {
  AMC: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Attendance Fill", href: "/fill", icon: BookOpen },
    { name: "Classes Management", href: "/edit", icon: Users },
    { name: "Table", href: "/table", icon: Table },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ],
  "Department Dean": [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Attendance Fill", href: "/fill", icon: BookOpen },
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
  const router = useRouter();

  if (!session) return null;

  const { name, email, role } = session.user;
  const navItems = navItemsByRole[role] || [];

  const sidebarWidth = isSidebarOpen
    ? SIDEBAR_WIDTH_FULL
    : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <aside
      className={`
        fixed top-16 bottom-0 left-0 z-50
        flex flex-col
        bg-gray-950/50 backdrop-blur-md
        border-r border-white/10
        transition-all ${DURATION} ease-in-out
        ${sidebarWidth}
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* NAV */}
      <nav className="flex flex-col p-2 space-y-2 flex-1">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={toggleSidebar}
            className="group flex items-center px-3 py-2 rounded-xl text-white hover:bg-gray-700 transition relative"
          >
            <item.icon className={`w-6 h-6 ${isSidebarOpen ? "mr-3" : ""}`} />

            <span
              className={`
                overflow-hidden whitespace-nowrap transition-all ${DURATION}
                ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0"}
              `}
            >
              {item.name}
            </span>

            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 p-2 bg-gray-800 text-sm rounded-lg opacity-0 group-hover:opacity-100 hidden md:block">
                {item.name}
              </div>
            )}
          </a>
        ))}
      </nav>

      {/* PROFILE */}
      <div className="border-t border-white/10 p-3 text-white">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6" />

          {isSidebarOpen && (
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-gray-400">{email}</p>
              <p className="text-xs text-blue-400">{role}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/auth" })}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-red-500/80 hover:bg-red-600 py-2 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          {isSidebarOpen && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
