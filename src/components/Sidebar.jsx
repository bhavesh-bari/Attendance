"use client";

import React, { useEffect, useState } from "react";
import { Home, Users, BookOpen, Table, BarChart3, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

const SIDEBAR_WIDTH_FULL = "w-48";
const SIDEBAR_WIDTH_COLLAPSED = "w-18";
const DURATION = "duration-300";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Attendance Fill", href: "/fill", icon: BookOpen },
  { name: "Classes Management", href: "/edit", icon: Users },
  { name: "Table", href: "/table", icon: Table },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setEmail(localStorage.getItem("email") || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const sidebarWidthClass = isSidebarOpen
    ? SIDEBAR_WIDTH_FULL
    : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <aside
      className={`
        fixed top-16 bottom-0 left-0 z-50
        flex flex-col shadow-2xl
        transition-all ${DURATION} ease-in-out
        ${sidebarWidthClass}

        bg-gray-950/50 backdrop-blur-md
        border-r border-white/10

        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >

      {/* NAVIGATION */}
      <nav className="flex flex-col p-2 space-y-2 flex-1">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={toggleSidebar}
            className="group flex items-center px-3 py-2 rounded-xl text-white hover:bg-gray-700 hover:text-blue-200 transition-colors relative"
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

      {/* PROFILE SECTION */}
      <div className="border-t border-white/10 p-3 text-white">

        <div className="flex items-center gap-3">
          <User className="w-6 h-6" />

          {isSidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium">{username}</p>
              <p className="text-xs text-gray-400">{email}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`
            mt-3 w-full flex items-center justify-center gap-2
            bg-red-500/80 hover:bg-red-600
            text-sm py-2 rounded-lg transition
          `}
        >
          <LogOut className="w-4 h-4" />
          {isSidebarOpen && "Sign Out"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
