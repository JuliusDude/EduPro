import { useState, useEffect } from 'react';
import { CheckCircle, X, Download, Loader2 } from 'lucide-react';
import { lecturerApi, type Subject } from '../../services/lecturerApi';

interface StudentAttendance {
    enrollmentId: string;
    studentId: string;
    studentName: string;
    studentNumber: string;
    totalClasses: number;
    present: number;
    absent: number;
    percentage: number;
    todayStatus: 'PRESENT' | 'ABSENT' | null;
    saving: boolean;
}

const LecturerAttendance = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [students, setStudents] = useState<StudentAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch subjects on mount
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const data = await lecturerApi.getSubjects();
                setSubjects(data);
                if (data.length > 0) {
                    setSelectedSubject(data[0].id);
                }
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

    // Fetch attendance stats when subject changes
    useEffect(() => {
        const fetchAttendance = async () => {
            if (!selectedSubject) return;
            try {
                const data = await lecturerApi.getAttendance(selectedSubject);
                setStudents(data.attendanceStats.map((s: any) => ({
                    enrollmentId: s.enrollmentId,
                    studentId: s.studentId,
                    studentName: s.studentName,
                    studentNumber: s.studentNumber,
                    totalClasses: s.totalClasses,
                    present: s.present,
                    absent: s.absent,
                    percentage: s.percentage,
                    todayStatus: null,
                    saving: false
                })));
            } catch (err: any) {
                console.error('Failed to fetch attendance:', err);
            }
        };
        fetchAttendance();
    }, [selectedSubject]);

    const markAttendance = async (studentId: string, status: 'PRESENT' | 'ABSENT') => {
        const student = students.find(s => s.studentId === studentId);
        if (!student || !selectedSubject) return;

        // Set saving state
        setStudents(prev => prev.map(s =>
            s.studentId === studentId ? { ...s, saving: true } : s
        ));

        try {
            const result = await lecturerApi.markSingleAttendance({
                subjectId: selectedSubject,
                enrollmentId: student.enrollmentId,
                studentId: student.studentId,
                status
            });

            // Update student with new stats from server
            setStudents(prev => prev.map(s =>
                s.studentId === studentId ? {
                    ...s,
                    totalClasses: result.data.totalClasses,
                    present: result.data.present,
                    absent: result.data.absent,
                    percentage: result.data.percentage,
                    todayStatus: status,
                    saving: false
                } : s
            ));
        } catch (err: any) {
            console.error('Failed to mark attendance:', err);
            alert(err.response?.data?.message || 'Failed to mark attendance');
            setStudents(prev => prev.map(s =>
                s.studentId === studentId ? { ...s, saving: false } : s
            ));
        }
    };

    const getStatusColor = (percentage: number) => {
        if (percentage >= 85) return 'text-emerald-600 dark:text-emerald-400';
        if (percentage >= 75) return 'text-amber-600 dark:text-amber-400';
        return 'text-rose-600 dark:text-rose-400';
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 85) return 'bg-emerald-500';
        if (percentage >= 75) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    const getStats = () => {
        const total = students.length;
        const markedToday = students.filter(s => s.todayStatus !== null).length;
        const presentToday = students.filter(s => s.todayStatus === 'PRESENT').length;
        return { total, markedToday, presentToday };
    };

    const stats = getStats();

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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Management</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Click to mark attendance for today - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Course
                </label>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                >
                    {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                            {subject.code} - {subject.name} ({subject.enrolledStudents} students)
                        </option>
                    ))}
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Marked Present Today</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.presentToday}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Marked Today</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.markedToday} / {stats.total}</p>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white">Student Attendance</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Click to mark attendance - updates are saved instantly</p>
                </div>
                {students.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-slate-500 dark:text-slate-400">No students enrolled in this course</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Roll No</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Student Name</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Overall</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Present/Total</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Today</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students.map(student => (
                                    <tr key={student.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{student.studentNumber}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{student.studentName}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${getProgressColor(student.percentage)}`}
                                                        style={{ width: `${student.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-sm font-bold ${getStatusColor(student.percentage)}`}>
                                                    {student.percentage}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">
                                            {student.present} / {student.totalClasses}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {student.saving ? (
                                                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => markAttendance(student.studentId, 'PRESENT')}
                                                            className={`p-2 rounded-lg transition-colors ${student.todayStatus === 'PRESENT'
                                                                ? 'bg-emerald-600 text-white'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 hover:text-emerald-600'
                                                                }`}
                                                            title="Mark Present"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => markAttendance(student.studentId, 'ABSENT')}
                                                            className={`p-2 rounded-lg transition-colors ${student.todayStatus === 'ABSENT'
                                                                ? 'bg-rose-600 text-white'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/20 hover:text-rose-600'
                                                                }`}
                                                            title="Mark Absent"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LecturerAttendance;
