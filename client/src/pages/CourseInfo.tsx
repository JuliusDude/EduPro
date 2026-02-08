import { useState, useEffect } from 'react';
import { Book, Clock, User } from 'lucide-react';
import studentApi from '../services/studentApi';

interface Subject {
    id: string;
    code: string;
    name: string;
    weeklyHours: number;
    totalHours: number;
    lecturer: {
        name: string;
        email: string;
    };
    enrollmentStatus: string;
    finalGrade: string | null;
}

interface Course {
    id: string;
    name: string;
    code: string;
    semester: number;
    department: string;
    subjects: Subject[];
}

const CourseInfo = () => {
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await studentApi.getCourses();
                setCourse(response.data.course);
            } catch (err: any) {
                console.error('Failed to fetch courses:', err);
                setError(err.response?.data?.message || 'Failed to load course data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const colors = ['indigo', 'emerald', 'amber', 'rose', 'blue', 'purple'];

    const getColorClasses = (color: string) => {
        const colorMap: Record<string, string> = {
            indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
            emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
            amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
            rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
            blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
            purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
        };
        return colorMap[color] || colorMap.indigo;
    };

    const getProgressColor = (color: string) => {
        const colorMap: Record<string, string> = {
            indigo: 'bg-indigo-600 dark:bg-indigo-500',
            emerald: 'bg-emerald-600 dark:bg-emerald-500',
            amber: 'bg-amber-600 dark:bg-amber-500',
            rose: 'bg-rose-600 dark:bg-rose-500',
            blue: 'bg-blue-600 dark:bg-blue-500',
            purple: 'bg-purple-600 dark:bg-purple-500',
        };
        return colorMap[color] || 'bg-indigo-600';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-slate-500 dark:text-slate-400">No course enrollment found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{course.name}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {course.code} • Semester {course.semester} • {course.department}
                        </p>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        {course.subjects.length} Subjects Enrolled
                    </div>
                </div>
            </div>

            {course.subjects.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-400">No subjects enrolled yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {course.subjects.map((subject, index) => {
                        const color = colors[index % colors.length];
                        // Mock progress - in real app this could come from syllabus completion
                        const progress = Math.floor(Math.random() * 40) + 40;

                        return (
                            <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl border ${getColorClasses(color)}`}>
                                        <Book className="w-6 h-6" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {subject.weeklyHours}h/week
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
                                        <span>{subject.lecturer.name}</span>
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
                                                className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(color)}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CourseInfo;
