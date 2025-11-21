import { useState } from 'react';
import { CheckCircle, X, Download } from 'lucide-react';

const LecturerAttendance = () => {
    const [selectedCourse, setSelectedCourse] = useState('CS-301');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const courses = [
        { id: 'CS-301', name: 'Data Structures & Algorithms', students: 30 },
        { id: 'CS-302', name: 'Web Development', students: 28 },
        { id: 'CS-303', name: 'Database Systems', students: 32 }
    ];

    const [students, setStudents] = useState([
        { id: 'S001', name: 'John Doe', rollNo: '001', status: 'present' },
        { id: 'S002', name: 'Jane Smith', rollNo: '002', status: 'present' },
        { id: 'S003', name: 'Mike Johnson', rollNo: '003', status: 'absent' },
        { id: 'S004', name: 'Sarah Williams', rollNo: '004', status: 'present' },
        { id: 'S005', name: 'Tom Brown', rollNo: '005', status: 'absent' },
    ]);

    const toggleAttendance = (studentId: string, status: 'present' | 'absent') => {
        setStudents(students.map(s =>
            s.id === studentId ? { ...s, status } : s
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50';
            case 'absent': return 'bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
        }
    };

    const getStats = () => {
        const present = students.filter(s => s.status === 'present').length;
        const absent = students.filter(s => s.status === 'absent').length;
        return { present, absent, total: students.length };
    };

    const stats = getStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Management</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Mark and manage student attendance</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Select Course
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                        >
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.id} - {course.name} ({course.students} students)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Present</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.present}</p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/50">
                    <p className="text-sm text-rose-600 dark:text-rose-400 mb-1">Absent</p>
                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.absent}</p>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white">Student Attendance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Roll No</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Student Name</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{student.rollNo}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{student.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => toggleAttendance(student.id, 'present')}
                                                className={`p-2 rounded-lg transition-colors ${student.status === 'present'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 hover:text-emerald-600'
                                                    }`}
                                                title="Mark Present"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleAttendance(student.id, 'absent')}
                                                className={`p-2 rounded-lg transition-colors ${student.status === 'absent'
                                                    ? 'bg-rose-600 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/20 hover:text-rose-600'
                                                    }`}
                                                title="Mark Absent"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                        Save Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LecturerAttendance;
