import React from 'react';
import {  ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';

const NAV_HEIGHT = 'h-16'; 

const DURATION = 'duration-300'; 

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
    const ToggleIcon = isSidebarOpen ? ArrowLeftToLine : ArrowRightToLine;

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-40 ${NAV_HEIGHT} bg-white shadow-lg flex items-center transition-all ${DURATION} border-b border-gray-200`}
        >
            <div className="flex items-center px-4 md:px-6">
  
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Toggle Sidebar"
                >
                    <ToggleIcon className="w-6 h-6" />
                </button>
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-800 ml-4">
                Hod Panel Dashboard
            </h1>
        </header>
    );
};

export default Navbar;