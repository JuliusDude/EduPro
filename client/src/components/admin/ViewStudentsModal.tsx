import { useState, useEffect } from 'react';
import { X, Users, Mail, BookOpen, GraduationCap } from 'lucide-react';
import api from '../../services/api';

interface ViewStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: any;
}

const ViewStudentsModal = ({ isOpen, onClose, course }: ViewStudentsModalProps) => {
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && course) {
            fetchStudents();
        }
    }, [isOpen, course]);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/admin/courses/${course.id}/students`);
            setStudents(response.data.data.students);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Enrolled Students
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {course.code} - {course.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-slate-500 dark:text-slate-400">Loading students...</div>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Users className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 text-center">
                                No students enrolled in this course yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm flex-shrink-0">
                                                {student.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {student.name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {student.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                        <GraduationCap className="w-3.5 h-3.5" />
                                                        {student.studentId}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        Semester {student.currentSemester}
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-1">
                                                        Enrolled Subjects ({student.enrolledSubjects.length}):
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {student.enrolledSubjects.map((subject: any) => (
                                                            <span
                                                                key={subject.subjectId}
                                                                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                                                title={subject.subjectName}
                                                            >
                                                                {subject.subjectCode}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Total: <span className="font-semibold text-slate-900 dark:text-white">{students.length}</span> student{students.length !== 1 ? 's' : ''}
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewStudentsModal;
