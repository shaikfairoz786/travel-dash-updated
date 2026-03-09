import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CubeIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    // Exact match for dashboard, startswith for others
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: HomeIcon },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarDaysIcon },
    { label: 'Customers', path: '/admin/customers', icon: UserGroupIcon },
    { label: 'Packages', path: '/admin/packages', icon: CubeIcon },
    { label: 'Blogs', path: '/admin/blogs', icon: PencilSquareIcon },
    { label: 'Contacts', path: '/admin/contacts', icon: EnvelopeIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white 
          transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col h-full border-r border-slate-800
        `}
      >
        {/* Logo Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <span className="font-bold text-white text-lg">T</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              TravelTemplate
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                            ${active
                    ? 'bg-gradient-brand text-white shadow-lg shadow-emerald-900/20 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }
                        `}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400 transition-colors'}`} />
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow"></div>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
          >
            <ArrowUturnLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Return to Site</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
