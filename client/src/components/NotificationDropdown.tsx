import { Bell, CheckCircle2, AlertCircle, Calendar, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const notifications = [
        {
            id: 1,
            type: 'assignment',
            title: 'New Assignment Posted',
            message: 'Web Development - Project submission due in 3 days',
            time: '2 hours ago',
            isRead: false,
            icon: Calendar,
            color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
        },
        {
            id: 2,
            type: 'grade',
            title: 'Assignment Graded',
            message: 'Data Structures - Lab 4 has been graded (A)',
            time: '5 hours ago',
            isRead: false,
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
        },
        {
            id: 3,
            type: 'attendance',
            title: 'Attendance Alert',
            message: 'Your attendance in Database Systems is below 75%',
            time: '1 day ago',
            isRead: true,
            icon: AlertCircle,
            color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20'
        },
        {
            id: 4,
            type: 'general',
            title: 'Course Material Updated',
            message: 'New lecture notes added for Operating Systems',
            time: '2 days ago',
            isRead: true,
            icon: Bell,
            color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
        }
    ];

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 transition-all duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => {
                            const Icon = notification.icon;
                            return (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className={`p-2 rounded-lg ${notification.color} shrink-0`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {notification.title}
                                                </h4>
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-1"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                                {notification.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <button className="w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
