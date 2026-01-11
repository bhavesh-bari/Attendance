import React from 'react';
import { Home, Users, BookOpen, Table } from 'lucide-react';
import { BarChart3 } from "lucide-react";

const SIDEBAR_WIDTH_FULL = 'w-48';
const SIDEBAR_WIDTH_COLLAPSED = 'w-18';
const DURATION = 'duration-300';

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Fill Forms", href: "/fill", icon: BookOpen },
    { name: "Edit Data", href: "/edit", icon: Users },
    { name: "Table", href: "/table", icon: Table },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
];
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const sidebarWidthClass = isSidebarOpen ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_COLLAPSED;

    return (
       <aside
  className={`
    fixed top-16 bottom-0 left-0 z-50 
    flex flex-col shadow-2xl
    transition-all ${DURATION} ease-in-out
    ${sidebarWidthClass}

    /* Glassmorphism */
    bg-gray-950/50 backdrop-blur-md
    border-r border-white/10

    /* Mobile slide */
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
  `}


        >


            <nav className="flex flex-col p-2 space-y-2  flex-1">
                {navItems.map((item) => (
                    <a key={item.name} href={item.href} onClick={toggleSidebar}
                        className="group flex items-center px-3 py-2 rounded-xl text-white hover:bg-gray-700 hover:text-blue-200  transition-colors relative"
                    >
                        <item.icon className={`w-6 h-6 flex-shrink-0 ${isSidebarOpen ? 'mr-3' : 'mr-0'}`} />

                        <span
                            className={`
                                overflow-hidden whitespace-nowrap transition-all ${DURATION}
                                ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 md:w-0 md:opacity-0'}
                                flex-1
                            `}
                        >
                            {item.name}
                        </span>


                        {!isSidebarOpen && (
                            <div className="absolute left-full ml-4 p-2 bg-gray-800 text-sm text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block z-50">
                                {item.name}
                            </div>
                        )}
                    </a>
                ))}
            </nav>
        </aside>
    );
};
export default Sidebar;