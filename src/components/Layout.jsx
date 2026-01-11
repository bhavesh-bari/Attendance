"use client";
import React, { useState, useCallback, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DURATION = "duration-300";
 
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 768 && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  }, [isSidebarOpen]);

  // Optional: Automatically close sidebar when resizing below md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarContentOffset = isSidebarOpen ? "ml-64" : "ml-20";
  const contentMarginClass = `md:${sidebarContentOffset}`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 relative">
      {/* Navbar */}
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden pt-16 transition-all ${DURATION} ${contentMarginClass}`}
      >
        {/* Overlay (for mobile) */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
            aria-hidden="true"
          ></div>
        )}

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
