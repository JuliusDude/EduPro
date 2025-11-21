import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Users, Clock, FileText } from 'lucide-react';

const LecturerCourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments'>('overview');

    // Mock Data
    const course = {
        id: id,
        name: 'Data Structures & Algorithms',
        code: 'CS-301',
        semester: '3rd Semester',
        description: 'This course covers fundamental data structures and algorithms, including arrays, linked lists, stacks, queues, trees, graphs, sorting, and searching.',
        schedule: 'Mon, Wed 09:00 AM - 10:30 AM',
        room: 'Room 301',
        students: 45,
        progress: 65,
        syllabus: [
            { week: 1, topic: 'Introduction to Data Structures', status: 'completed' },
            { week: 2, topic: 'Arrays and Linked Lists', status: 'completed' },
            { week: 3, topic: 'Stacks and Queues', status: 'completed' },
            { week: 4, topic: 'Trees and Binary Search Trees', status: 'in-progress' },
            { week: 5, topic: 'Graphs and Graph Algorithms', status: 'upcoming' },
        ]
    };

    const students = [
        { id: 'S001', name: 'John Doe', email: 'john@edu.com', attendance: 92, grade: 'A' },
        { id: 'S002', name: 'Jane Smith', email: 'jane@edu.com', attendance: 88, grade: 'B+' },
        { id: 'S003', name: 'Mike Johnson', email: 'mike@edu.com', attendance: 75, grade: 'C' },
    ];

    const assignments = [
        { id: 1, title: 'Lab 1: Arrays', dueDate: '2024-10-15', status: 'completed' },
        { id: 2, title: 'Lab 2: Linked Lists', dueDate: '2024-10-22', status: 'completed' },
        { id: 3, title: 'Assignment 1: Stack Implementation', dueDate: '2024-11-05', status: 'active' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => navigate('/lecturer/courses')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{course.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{course.code} • {course.semester}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                {['overview', 'students', 'assignments'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Course Description</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {course.description}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Syllabus</h3>
                                <div className="space-y-4">
                                    {course.syllabus.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                item.status === 'in-progress' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                                    'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                                                }`}>
                                                {item.week}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900 dark:text-white">{item.topic}</p>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                                item.status === 'in-progress' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' :
                                                    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Schedule</p>
                                            <p className="font-medium">{course.schedule}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <Users className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Enrolled Students</p>
                                            <p className="font-medium">{course.students} Students</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <Book className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Room</p>
                                            <p className="font-medium">{course.room}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Attendance</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.name}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{student.email}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{student.attendance}%</td>
                                        <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">{student.grade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-4">
                        {assignments.map((assignment) => (
                            <div key={assignment.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{assignment.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/lecturer/assignments/${assignment.id}`)}
                                    className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                >
                                    View Submissions
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LecturerCourseDetails;
