import { useState, useEffect } from 'react';
import { Book, Users, Clock, MoreVertical, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { lecturerApi, type Subject } from '../../services/lecturerApi';

const LecturerCourses = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const data = await lecturerApi.getSubjects();
                setSubjects(data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch subjects:', err);
                setError(err.response?.data?.message || 'Failed to load subjects');
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const getColor = (index: number) => {
        const colors = ['indigo', 'emerald', 'amber', 'rose', 'blue', 'purple'];
        return colors[index % colors.length];
    };

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your active courses and materials</p>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {subjects.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <Book className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No subjects assigned yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subjects.map((subject, index) => {
                        const color = getColor(index);
                        return (
                            <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl bg-${color}-50 dark:bg-${color}-900/20`}>
                                            <Book className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{subject.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{subject.code} • Semester {subject.semester}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            {subject.enrolledStudents} Students
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            {subject.weeklyHours}h/week
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-500 dark:text-slate-400">Avg Attendance</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{subject.averageAttendance}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-${color}-600 rounded-full transition-all duration-500`}
                                                style={{ width: `${subject.averageAttendance}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {subject.activeAssignments} active assignment{subject.activeAssignments !== 1 ? 's' : ''}
                                        </div>
                                        <button
                                            onClick={() => navigate(`/lecturer/courses/${subject.id}`)}
                                            className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
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

export default LecturerCourses;
