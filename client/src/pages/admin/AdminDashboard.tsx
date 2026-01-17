import { useState, useEffect } from 'react';
import { Users, BookOpen, Building2, Activity, TrendingUp, Calendar } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                const data = response.data.data;

                // Map icon strings to components
                const mappedStats = data.stats.map((stat: any) => ({
                    ...stat,
                    icon: getIconComponent(stat.icon)
                }));

                setStats(mappedStats);
                setRecentActivity(data.recentActivity);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'Users': return Users;
            case 'BookOpen': return BookOpen;
            case 'Building2': return Building2;
            case 'Activity': return Activity;
            default: return Activity;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">System overview and management</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up'
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                {stat.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
                        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium">View All</button>
                    </div>
                    <div className="space-y-6">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className={`p-2 rounded-full shrink-0 ${activity.type === 'course' ? 'bg-indigo-50 text-indigo-600' :
                                    activity.type === 'department' ? 'bg-purple-50 text-purple-600' :
                                        activity.type === 'system' ? 'bg-slate-100 text-slate-600' :
                                            'bg-blue-50 text-blue-600'
                                    } dark:bg-slate-800 dark:text-slate-400`}>
                                    {activity.type === 'course' && <BookOpen className="w-4 h-4" />}
                                    {activity.type === 'department' && <Building2 className="w-4 h-4" />}
                                    {activity.type === 'system' && <Activity className="w-4 h-4" />}
                                    {activity.type === 'user' && <Users className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {activity.user} <span className="text-slate-500 font-normal">{activity.action}</span>
                                    </p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-0.5">{activity.target}</p>
                                    <p className="text-xs text-slate-400 mt-1">{new Date(activity.time).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left group">
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                <Users className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Add New User</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left group">
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Create Course</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left group">
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Update Calendar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
