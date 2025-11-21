import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    CheckSquare,
    BookOpen,
    FileText,
    GraduationCap,
    Book,
    Calendar,
    Users,
    ClipboardList,
    Settings,
    BarChart
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();

    // Role-based navigation
    const getNavItems = () => {
        switch (user?.role) {
            case 'student':
                return [
                    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
                    { path: '/timetable', icon: Calendar, label: 'Timetable' },
                    { path: '/courses', icon: Book, label: 'Course Info' },
                    { path: '/attendance', icon: CheckSquare, label: 'Attendance' },
                    { path: '/assignments', icon: BookOpen, label: 'Assignments' },
                    { path: '/notes', icon: FileText, label: 'Notes & Resources' },
                ];

            case 'lecturer':
                return [
                    { path: '/lecturer', icon: LayoutDashboard, label: 'Dashboard' },
                    { path: '/lecturer/courses', icon: Book, label: 'My Courses' },
                    { path: '/lecturer/attendance', icon: CheckSquare, label: 'Attendance' },
                    { path: '/lecturer/assignments', icon: ClipboardList, label: 'Assignments' },
                    { path: '/lecturer/students', icon: Users, label: 'Students' },
                ];

            case 'admin':
                return [
                    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
                    { path: '/admin/users', icon: Users, label: 'Users' },
                    { path: '/admin/courses', icon: Book, label: 'Courses' },
                    { path: '/admin/reports', icon: BarChart, label: 'Reports' },
                    { path: '/admin/settings', icon: Settings, label: 'Settings' },
                ];

            default:
                return [];
        }
    };

    const navItems = getNavItems();

    // Role colors
    const getRoleBadge = () => {
        switch (user?.role) {
            case 'student':
                return { label: 'Student', color: 'bg-indigo-600' };
            case 'lecturer':
                return { label: 'Lecturer', color: 'bg-emerald-600' };
            case 'admin':
                return { label: 'Admin', color: 'bg-rose-600' };
            default:
                return { label: 'User', color: 'bg-slate-600' };
        }
    };

    const roleBadge = getRoleBadge();

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-10 transition-all duration-300">
            <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
                <div className={`${roleBadge.color} p-2 rounded-lg`}>
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">EduPro</span>
                    <span className={`block text-xs px-2 py-0.5 ${roleBadge.color} text-white rounded-md w-fit mt-1`}>
                        {roleBadge.label}
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/' || item.path === '/lecturer' || item.path === '/admin'}
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
        </aside>
    );
};

export default Sidebar;
