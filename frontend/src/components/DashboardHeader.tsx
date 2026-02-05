import React, { useState } from 'react';
import { Bars3Icon, BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <header className="bg-white sticky top-0 z-30 border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
            {/* Left: Mobile Menu & Branding */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Toggle Menu"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>

                {/* Breadcrumb or Page Title (Hidden on very small screens) */}
                <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
                    <p className="text-xs text-secondary-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-3 sm:gap-6">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                            <span className="font-bold text-sm sm:text-base">{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                        </div>
                        <div className="hidden md:block text-left mr-2">
                            <p className="text-sm font-bold text-gray-700 leading-tight">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-primary-600 font-medium">Administrator</p>
                        </div>
                        <ChevronDownIcon className="w-4 h-4 text-gray-400 hidden md:block" />
                    </button>

                    {/* Dropdown Menu */}
                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transform origin-top-right transition-all animate-fade-in z-50">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Account</p>
                            </div>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">Profile Settings</a>
                            <div className="border-t border-gray-50 my-1"></div>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
