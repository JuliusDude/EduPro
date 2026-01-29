import { useState, useEffect } from 'react';
import { Search, Filter, Loader2, Users } from 'lucide-react';
import StudentProfileModal from '../../components/StudentProfileModal';
import AnnouncementModal from '../../components/AnnouncementModal';
import { lecturerApi, type Student, type Subject } from '../../services/lecturerApi';

const LecturerStudents = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [subjectsData, studentsData] = await Promise.all([
                    lecturerApi.getSubjects(),
                    lecturerApi.getStudents()
                ]);
                setSubjects(subjectsData);
                setStudents(studentsData);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch data:', err);
                setError(err.response?.data?.message || 'Failed to load students');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSendAnnouncement = (announcement: any) => {
        console.log('Sending announcement:', announcement);
        setIsAnnouncementOpen(false);
    };

    const filteredStudents = students.filter(student => {
        // Filter by course
        if (selectedCourse !== 'all' && !student.subjects.some(s => s.id === selectedCourse)) {
            return false;
        }
        // Filter by search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                student.firstName.toLowerCase().includes(term) ||
                student.lastName.toLowerCase().includes(term) ||
                student.email.toLowerCase().includes(term) ||
                student.studentNumber.toLowerCase().includes(term)
            );
        }
        return true;
    });

    const handleStudentClick = (student: Student) => {
        setSelectedStudent({
            ...student,
            name: `${student.firstName} ${student.lastName}`,
            attendance: student.overallAttendance,
            grade: student.gpa ? `${student.gpa.toFixed(1)}` : 'N/A',
            assignments: student.subjects.length > 0 ? 100 : 0, // Placeholder
            status: student.overallAttendance >= 85 ? 'active' : student.overallAttendance >= 75 ? 'at-risk' : 'critical'
        });
        setIsProfileOpen(true);
    };

    const getStatusFromAttendance = (attendance: number) => {
        if (attendance >= 85) return 'active';
        if (attendance >= 75) return 'at-risk';
        return 'critical';
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Students</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and monitor student performance</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm">
                            Export List
                        </button>
                        <button
                            onClick={() => setIsAnnouncementOpen(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm shadow-indigo-200 dark:shadow-none"
                        >
                            Send Announcement
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all min-w-[200px]"
                    >
                        <option value="all">All Courses</option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>{subject.code}: {subject.name}</option>
                        ))}
                    </select>

                    <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                    />
                </div>
            </div>

            {/* Students List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
                {filteredStudents.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">No students found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Course</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Attendance</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Subjects</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">GPA</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredStudents.map((student) => {
                                    const status = getStatusFromAttendance(student.overallAttendance);
                                    return (
                                        <tr
                                            key={student.id}
                                            onClick={() => handleStudentClick(student)}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                                        {student.firstName[0]}{student.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.firstName} {student.lastName}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                                    {student.course}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${student.overallAttendance >= 85 ? 'bg-emerald-500' :
                                                                student.overallAttendance >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                                                                }`}
                                                            style={{ width: `${student.overallAttendance}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{student.overallAttendance}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                    {student.subjects.length} enrolled
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${student.gpa && student.gpa >= 3.5 ? 'text-emerald-600 dark:text-emerald-400' :
                                                    student.gpa && student.gpa >= 3.0 ? 'text-indigo-600 dark:text-indigo-400' :
                                                        student.gpa && student.gpa >= 2.5 ? 'text-amber-600 dark:text-amber-400' :
                                                            'text-slate-600 dark:text-slate-400'
                                                    }`}>
                                                    {student.gpa ? student.gpa.toFixed(2) : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {status === 'active' && (
                                                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                                        Active
                                                    </span>
                                                )}
                                                {status === 'at-risk' && (
                                                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                                        At Risk
                                                    </span>
                                                )}
                                                {status === 'critical' && (
                                                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                                                        Critical
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <StudentProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                student={selectedStudent}
            />

            <AnnouncementModal
                isOpen={isAnnouncementOpen}
                onClose={() => setIsAnnouncementOpen(false)}
                onSend={handleSendAnnouncement}
            />
        </div>
    );
};

export default LecturerStudents;
