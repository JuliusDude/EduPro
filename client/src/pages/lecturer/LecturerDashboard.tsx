import { useState, useEffect } from 'react';
import { BookOpen, Users, ClipboardCheck, FileText, Calendar, Loader2 } from 'lucide-react';
import { lecturerApi, type DashboardData } from '../../services/lecturerApi';

const LecturerDashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const data = await lecturerApi.getDashboard();
                setDashboardData(data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch dashboard:', err);
                setError(err.response?.data?.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl">
                <p>{error}</p>
            </div>
        );
    }

    const stats = [
        { label: 'Courses Teaching', value: dashboardData?.stats.totalSubjects || 0, icon: BookOpen, color: 'indigo', change: 'Active subjects' },
        { label: 'Total Students', value: dashboardData?.stats.totalStudents || 0, icon: Users, color: 'emerald', change: 'Enrolled across subjects' },
        { label: 'Pending Grading', value: dashboardData?.stats.pendingGrading || 0, icon: ClipboardCheck, color: 'amber', change: 'Submissions to review' }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Welcome back, Professor!
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your courses today</p>
                    </div>
                    <Calendar className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                                    <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{stat.label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">{stat.change}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Grading */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pending Grading</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Assignments waiting for review</p>
                    </div>
                    <div className="p-4 space-y-3">
                        {dashboardData?.recentAssignments && dashboardData.recentAssignments.length > 0 ? (
                            dashboardData.recentAssignments.map((assignment) => (
                                <div key={assignment.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{assignment.title}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{assignment.subject}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-md">
                                            {assignment.gradedSubmissions}/{assignment.totalSubmissions}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                                                style={{ width: `${assignment.totalSubmissions > 0 ? (assignment.gradedSubmissions / assignment.totalSubmissions) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-3 text-xs text-slate-400">
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-4">No assignments yet</p>
                        )}
                    </div>
                </div>

                {/* Today's Classes */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Classes</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your schedule for today</p>
                    </div>
                    <div className="p-4 space-y-3">
                        {dashboardData?.todaySchedule && dashboardData.todaySchedule.length > 0 ? (
                            dashboardData.todaySchedule.map((classItem) => (
                                <div key={classItem.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{classItem.subject}</h3>
                                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{classItem.time}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-3.5 h-3.5" />
                                            {classItem.room || 'TBA'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {classItem.course}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-4">No classes scheduled for today</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;
