import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BookOpen, FileText, LogOut, GraduationCap } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/attendance', icon: CheckSquare, label: 'Attendance' },
        { path: '/assignments', icon: BookOpen, label: 'Assignments' },
        { path: '/notes', icon: FileText, label: 'Notes & Resources' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-10 transition-all duration-300">
            <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">EduPro</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
