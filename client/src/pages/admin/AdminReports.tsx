import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Users, BookOpen, FileText } from 'lucide-react';

const AdminReports = () => {
    const [reportType, setReportType] = useState<'performance' | 'attendance' | 'financial'>('performance');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Reports</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Analytics and performance metrics</p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value as any)}
                    >
                        <option value="performance">Performance Report</option>
                        <option value="attendance">Attendance Report</option>
                        <option value="financial">Financial Report</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200 dark:shadow-none">
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12%
                        </span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Enrollment</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2,543</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +5%
                        </span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Course Completion</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">85%</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                            <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                            -2%
                        </span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg. Attendance</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">92%</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +8%
                        </span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Assignments Submitted</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12,450</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Student Performance Distribution</h3>
                        <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {[35, 55, 75, 60, 85, 95, 70].map((height, i) => (
                            <div key={i} className="w-full bg-indigo-100 dark:bg-indigo-900/20 rounded-t-lg relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-indigo-600 dark:bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:opacity-80"
                                    style={{ height: `${height}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 dark:text-slate-400 px-4">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Department Enrollment</h3>
                        <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Computer Science', value: 45, color: 'bg-indigo-600' },
                            { name: 'Business Admin', value: 30, color: 'bg-purple-600' },
                            { name: 'Mathematics', value: 15, color: 'bg-blue-600' },
                            { name: 'Physics', value: 10, color: 'bg-emerald-600' }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                                    <span className="text-slate-500 dark:text-slate-400">{item.value}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                    <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
