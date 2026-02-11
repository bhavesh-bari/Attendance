import React from "react";
import { ArrowLeftToLine, ArrowRightToLine, User } from "lucide-react";
import { useSession } from "next-auth/react";

const NAV_HEIGHT = "h-16";
const DURATION = "duration-300";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const ToggleIcon = isSidebarOpen ? ArrowLeftToLine : ArrowRightToLine;
  const { data: session } = useSession();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 ${NAV_HEIGHT} 
      bg-white/70 backdrop-blur-md border-b border-gray-200/50 
      flex items-center justify-between px-4 md:px-8 transition-all ${DURATION}`}
    >
      {/* Left Section: Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-sky-500 bg-cyan-100 p-2 rounded-xl  hover:text-cyan-600 hover:bg-cyan-50 
                     active:scale-95 transition-all duration-200 focus:outline-none 
                     focus:ring-2 focus:ring-cyan-400/50 border border-transparent hover:border-cyan-100"
          aria-label="Toggle Sidebar"
        >
          <ToggleIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 py-1 px-3 rounded-full bg-gray-50 border border-gray-100">
          <img
            className="md:w-8 md:h-8 w-6 h-6 rounded-full object-cover ring-2 ring-white"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPfRGkuQoqWR3mDkAT6l6gjRPN-zRI41VIxw&s"
            alt="JSPM Logo"
          />
          <span className="md:text-lg text-xs font-semibold text-gray-700 lg:block">
            JSPM Narhe Technical Campus
          </span>
        </div>

      </div>

      {/* Right Section: Branding & Profile */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* College Branding - Hidden on tiny screens, simplified on mobile */}
        <div className="md:flex md:flex-col hidden">
          <h1 className="text-sm  text-cyan-500 md:text-lg leading-tight truncate max-w-[150px] md:max-w-none">
            {session?.user?.role || "Faculty"} Dashboard
          </h1>
          <p className="text-[10px] text-gray-500 font-medium md:hidden">
            JSPM Narhe
          </p>
        </div>

        {/* User Profile Circle */}
        <div className="flex items-center gap-2 border-l pl-3 md:pl-6 border-gray-200">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-900">{session?.user?.name || "User Name"}</p>
            <p className="text-[10px] text-gray-400 capitalize">{session?.user?.role || "Staff"}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
            {session?.user?.image ? (
              <img src={session.user.image} className="rounded-full" alt="profile" />
            ) : (
              <User size={18} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;