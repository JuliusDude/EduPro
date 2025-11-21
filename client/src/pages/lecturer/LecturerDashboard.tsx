import { BookOpen, Users, ClipboardCheck, FileText, Calendar } from 'lucide-react';

const LecturerDashboard = () => {
    const stats = [
        { label: 'Courses Teaching', value: '5', icon: BookOpen, color: 'indigo', change: '+1 this semester' },
        { label: 'Total Students', value: '142', icon: Users, color: 'emerald', change: '5 courses' },
        { label: 'Pending Grading', value: '23', icon: ClipboardCheck, color: 'amber', change: '3 assignments' }
    ];

    const recentAssignments = [
        { course: 'Data Structures', title: 'Lab 4 - Trees', submitted: 28, total: 30, dueDate: '2 days ago' },
        { course: 'Web Development', title: 'Project 2', submitted: 25, total: 28, dueDate: 'Yesterday' },
        { course: 'Database Systems', title: 'Normalization', submitted: 22, total: 32, dueDate: 'Today' }
    ];

    const upcomingClasses = [
        { course: 'Data Structures', time: '09:00 AM', room: 'Room 301', students: 30 },
        { course: 'Web Development', time: '11:00 AM', room: 'Lab 3', students: 28 },
        { course: 'Database Systems', time: '02:00 PM', room: 'Room 201', students: 32 }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Dr. Wilson!</h1>
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
                        {recentAssignments.map((assignment, index) => (
                            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{assignment.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{assignment.course}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-md">
                                        {assignment.submitted}/{assignment.total}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                                            style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="ml-3 text-xs text-slate-400">{assignment.dueDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's Classes */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Classes</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your schedule for today</p>
                    </div>
                    <div className="p-4 space-y-3">
                        {upcomingClasses.map((classItem, index) => (
                            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{classItem.course}</h3>
                                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{classItem.time}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <FileText className="w-3.5 h-3.5" />
                                        {classItem.room}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" />
                                        {classItem.students} students
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;
