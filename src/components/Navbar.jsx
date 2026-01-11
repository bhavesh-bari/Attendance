import React from "react";
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";

const NAV_HEIGHT = "h-16";

const DURATION = "duration-300";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const ToggleIcon = isSidebarOpen ? ArrowLeftToLine : ArrowRightToLine;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 ${NAV_HEIGHT}   shadow-lg flex items-center transition-all ${DURATION} border-b"fixed top-0 w-full bg-white/30 backdrop-blur-md   border-white/40"`}
    >
      <div className="flex items-center px-4 md:px-6">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg
                    text-white
                bg-black/40 backdrop-blur-md
                  border border-white/10
                hover:bg-black/60
            hover:text-cyan-300
            hover:shadow-[0_0_12px_rgba(34,211,238,0.6)]
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-cyan-400
"
          aria-label="Toggle Sidebar"
        > 
       
          <ToggleIcon className="w-6 h-6" />
        </button>
      </div>

      <h1 className="peaky-text text-2xl  text-[#101828] ml-4" >
        HOD Panel Dashboard
      </h1>
       <div >
       <h2 className="college-text absolute right-4 bottom-4  ">
            <img className="rounded-2xl size-8 " src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPfRGkuQoqWR3mDkAT6l6gjRPN-zRI41VIxw&s" alt="JSPM Logo" />
                  JSPM Narhe Technical Campus
            </h2></div>
    </header>
  );
};

export default Navbar;
