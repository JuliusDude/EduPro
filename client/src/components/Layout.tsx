import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import ProfileModal from './ProfileModal';

interface LayoutProps {
    role?: 'student' | 'lecturer' | 'admin';
    children?: React.ReactNode;
}

const Layout = ({ role, children }: LayoutProps) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const getInitials = () => {
        if (!user) return 'U';
        return `${user.firstName[0]}${user.lastName[0]}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Sidebar role={role} />

            <main className="ml-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-8 flex items-center justify-end transition-colors duration-300">

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>

                        <NotificationDropdown />

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 pr-3 rounded-full transition-all"
                        >
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-sm">
                                {getInitials()}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 leading-none">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.department}</p>
                            </div>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {children || <Outlet />}
                </div>
            </main>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
};

export default Layout;
