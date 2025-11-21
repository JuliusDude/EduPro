import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Users, BookOpen, FileText, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminReports = () => {
    const [reportType, setReportType] = useState<'performance' | 'attendance' | 'financial'>('performance');
    const [dateRange, setDateRange] = useState('thisMonth');

    // Mock performance data
    const performanceData = [
        { student: 'John Doe', id: 'S2024001', department: 'CS', gpa: 3.8, status: 'excellent' },
        { student: 'Jane Smith', id: 'S2024002', department: 'Math', gpa: 3.5, status: 'good' },
        { student: 'Mike Johnson', id: 'S2024003', department: 'CS', gpa: 2.9, status: 'average' },
        { student: 'Sarah Williams', id: 'S2024004', department: 'Physics', gpa: 3.9, status: 'excellent' },
        { student: 'Tom Brown', id: 'S2024005', department: 'Business', gpa: 2.5, status: 'needs-attention' }
    ];

    // Mock attendance data
    const attendanceData = [
        { course: 'CS-301', students: 45, avgAttendance: 92, status: 'good' },
        { course: 'CS-302', students: 52, avgAttendance: 85, status: 'good' },
        { course: 'MATH-201', students: 38, avgAttendance: 78, status: 'average' },
        { course: 'PHY-101', students: 42, avgAttendance: 72, status: 'needs-attention' },
        { course: 'BUS-401', students: 60, avgAttendance: 88, status: 'good' }
    ];

    // Mock financial data
    const financialData = [
        { category: 'Tuition Fees', amount: 1500000, percentage: 75, trend: 'up' },
        { category: 'Lab Fees', amount: 200000, percentage: 10, trend: 'up' },
        { category: 'Library Fees', amount: 100000, percentage: 5, trend: 'stable' },
        { category: 'Sports Fees', amount: 150000, percentage: 7.5, trend: 'down' },
        { category: 'Other', amount: 50000, percentage: 2.5, trend: 'stable' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent':
            case 'good':
                return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
            case 'average':
                return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
            case 'needs-attention':
                return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
            default:
                return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800';
        }
    };

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
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="thisWeek">This Week</option>
                        <option value="thisMonth">This Month</option>
                        <option value="thisQuarter">This Quarter</option>
                        <option value="thisYear">This Year</option>
                    </select>
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

            {/* Detailed Report Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {reportType === 'performance' ? 'Student Performance Data' :
                                reportType === 'attendance' ? 'Course Attendance Data' :
                                    'Financial Overview'}
                        </h2>
                        <button className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {reportType === 'performance' && (
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Department</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">GPA</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {performanceData.map((record, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{record.student}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{record.id}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{record.department}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{record.gpa.toFixed(1)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(record.status)}`}>
                                                {record.status === 'excellent' || record.status === 'good' ? <CheckCircle className="w-3 h-3" /> :
                                                    record.status === 'needs-attention' ? <AlertCircle className="w-3 h-3" /> :
                                                        <XCircle className="w-3 h-3" />}
                                                {record.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {reportType === 'attendance' && (
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Course</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Students</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Avg Attendance</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {attendanceData.map((record, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{record.course}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{record.students}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 max-w-[120px]">
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${record.avgAttendance >= 85 ? 'bg-emerald-500' : record.avgAttendance >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                            style={{ width: `${record.avgAttendance}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{record.avgAttendance}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(record.status)}`}>
                                                {record.status === 'good' ? <CheckCircle className="w-3 h-3" /> :
                                                    record.status === 'needs-attention' ? <AlertCircle className="w-3 h-3" /> :
                                                        <XCircle className="w-3 h-3" />}
                                                {record.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {reportType === 'financial' && (
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Percentage</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {financialData.map((record, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{record.category}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">${record.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 max-w-[120px]">
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                                        <div
                                                            className="h-2 rounded-full bg-indigo-500"
                                                            style={{ width: `${record.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">{record.percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${record.trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                                                    record.trend === 'down' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                                                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                                <TrendingUp className={`w-3 h-3 ${record.trend === 'down' ? 'rotate-180' : ''}`} />
                                                {record.trend}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Trends</h3>
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
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Department Distribution</h3>
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
