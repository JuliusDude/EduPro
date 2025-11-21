import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import StudentProfileModal from '../../components/StudentProfileModal';

import AnnouncementModal from '../../components/AnnouncementModal';

const LecturerStudents = () => {
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

    const handleSendAnnouncement = (announcement: any) => {
        console.log('Sending announcement:', announcement);
        // Here you would typically make an API call to send the announcement
        setIsAnnouncementOpen(false);
    };

    const students = [
        {
            id: 'S001',
            name: 'John Doe',
            email: 'john.doe@edu.com',
            course: 'CS-301',
            attendance: 92,
            grade: 'A',
            assignments: 95,
            status: 'active'
        },
        {
            id: 'S002',
            name: 'Jane Smith',
            email: 'jane.smith@edu.com',
            course: 'CS-301',
            attendance: 85,
            grade: 'B+',
            assignments: 88,
            status: 'active'
        },
        {
            id: 'S003',
            name: 'Mike Johnson',
            email: 'mike.j@edu.com',
            course: 'CS-302',
            attendance: 75,
            grade: 'C',
            assignments: 72,
            status: 'at-risk'
        },
        {
            id: 'S004',
            name: 'Sarah Williams',
            email: 'sarah.w@edu.com',
            course: 'CS-303',
            attendance: 98,
            grade: 'A+',
            assignments: 99,
            status: 'active'
        },
        {
            id: 'S005',
            name: 'Tom Brown',
            email: 'tom.b@edu.com',
            course: 'CS-302',
            attendance: 60,
            grade: 'D',
            assignments: 55,
            status: 'critical'
        }
    ];

    const filteredStudents = selectedCourse === 'all'
        ? students
        : students.filter(s => s.course === selectedCourse);

    const handleStudentClick = (student: any) => {
        setSelectedStudent(student);
        setIsProfileOpen(true);
    };

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
                        <option value="CS-301">CS-301: Data Structures</option>
                        <option value="CS-302">CS-302: Web Development</option>
                        <option value="CS-303">CS-303: Database Systems</option>
                    </select>

                    <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                    />
                </div>
            </div>

            {/* Students List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Course</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Attendance</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Assignments</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Grade</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    onClick={() => handleStudentClick(student)}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.name}</p>
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
                                                    className={`h-full rounded-full ${student.attendance >= 85 ? 'bg-emerald-500' :
                                                        student.attendance >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                                                        }`}
                                                    style={{ width: `${student.attendance}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{student.attendance}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-indigo-500 h-full rounded-full"
                                                    style={{ width: `${student.assignments}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{student.assignments}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${student.grade.startsWith('A') ? 'text-emerald-600 dark:text-emerald-400' :
                                            student.grade.startsWith('B') ? 'text-indigo-600 dark:text-indigo-400' :
                                                student.grade.startsWith('C') ? 'text-amber-600 dark:text-amber-400' :
                                                    'text-rose-600 dark:text-rose-400'
                                            }`}>
                                            {student.grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.status === 'active' && (
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                                Active
                                            </span>
                                        )}
                                        {student.status === 'at-risk' && (
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                                At Risk
                                            </span>
                                        )}
                                        {student.status === 'critical' && (
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                                                Critical
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
