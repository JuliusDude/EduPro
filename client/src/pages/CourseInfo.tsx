import { Book, Clock, User } from 'lucide-react';

const CourseInfo = () => {
    const subjects = [
        {
            id: 1,
            name: 'Data Structures & Algorithms',
            code: 'CS-301',
            professor: 'Dr. Sarah Wilson',
            totalHours: 45,
            completedHours: 32,
            credits: 4,
            color: 'indigo'
        },
        {
            id: 2,
            name: 'Web Development',
            code: 'CS-302',
            professor: 'Prof. Michael Chen',
            totalHours: 40,
            completedHours: 28,
            credits: 3,
            color: 'emerald'
        },
        {
            id: 3,
            name: 'Database Management Systems',
            code: 'CS-303',
            professor: 'Dr. Emily Davis',
            totalHours: 45,
            completedHours: 15,
            credits: 4,
            color: 'amber'
        },
        {
            id: 4,
            name: 'Computer Networks',
            code: 'CS-304',
            professor: 'Prof. James Miller',
            totalHours: 40,
            completedHours: 10,
            credits: 3,
            color: 'rose'
        },
        {
            id: 5,
            name: 'Operating Systems',
            code: 'CS-305',
            professor: 'Dr. Robert Taylor',
            totalHours: 45,
            completedHours: 40,
            credits: 4,
            color: 'blue'
        }
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
            emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
            amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
            rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
            blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
        };
        return colors[color] || colors.indigo;
    };

    const getProgressColor = (color: string) => {
        const colors: Record<string, string> = {
            indigo: 'bg-indigo-600 dark:bg-indigo-500',
            emerald: 'bg-emerald-600 dark:bg-emerald-500',
            amber: 'bg-amber-600 dark:bg-amber-500',
            rose: 'bg-rose-600 dark:bg-rose-500',
            blue: 'bg-blue-600 dark:bg-blue-500',
        };
        return colors[color] || 'bg-indigo-600';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Course Curriculum</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track your progress and subject details.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {subjects.map(subject => {
                    const progress = Math.round((subject.completedHours / subject.totalHours) * 100);

                    return (
                        <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl border ${getColorClasses(subject.color)}`}>
                                    <Book className="w-6 h-6" />
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {subject.credits} Credits
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {subject.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                                    {subject.code}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span>{subject.professor}</span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span>{subject.totalHours} Total Hours</span>
                                </div>

                                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-slate-600 dark:text-slate-400">Completion</span>
                                        <span className="text-slate-900 dark:text-white">{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(subject.color)}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CourseInfo;
