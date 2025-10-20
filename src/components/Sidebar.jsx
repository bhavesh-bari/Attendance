// Sidebar.js
import Link from "next/link";
import { Home, Settings, Users, BookOpen } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: BookOpen },
    { name: "Team", href: "/team", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
];

const Sidebar = ({ isOpen }) => {
    return (
        <div
            className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:h-screen
      `}
        >
            <div className="p-4 text-2xl font-bold border-b border-gray-700">
                Hod Panel
            </div>

            <nav className="flex flex-col p-2 space-y-2">
                {navItems.map((item) => (
                    <Link key={item.name} href={item.href} legacyBehavior>
                        <a className="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white">
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </a>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
