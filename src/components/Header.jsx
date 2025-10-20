// /components/Header.js
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Header = ({ userName, title }) => (
    <header className="sticky top-0 z-20 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">{title}</h1>
            <div className="flex items-center space-x-3 text-gray-600">
                <span className="font-medium hidden sm:inline">{userName} (Principal)</span>
                <UserCircleIcon className="h-10 w-10 text-indigo-500" />
            </div>
        </div>
    </header>
);

export default Header;