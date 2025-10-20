// Layout.js
"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex justify-between items-center p-4 bg-white shadow md:hidden">
          <div className="text-xl font-semibold">Page Title</div>
          <button onClick={toggleSidebar} className="p-2 text-gray-600 focus:outline-none">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Overlay when sidebar is open on mobile */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          ></div>
        )}

        {/* Scrollable main content */}
        <main className="p-6 overflow-auto h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
