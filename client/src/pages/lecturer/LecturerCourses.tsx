import { Book, Users, Clock, MoreVertical, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LecturerCourses = () => {
    const navigate = useNavigate();
    const courses = [
        {
            id: 'CS-301',
            name: 'Data Structures & Algorithms',
            semester: '3rd Semester',
            students: 45,
            schedule: 'Mon, Wed 09:00 AM',
            room: 'Room 301',
            progress: 65,
            color: 'indigo',
            nextClass: 'Tomorrow, 09:00 AM'
        },
        {
            id: 'CS-302',
            name: 'Web Development',
            semester: '3rd Semester',
            students: 38,
            schedule: 'Tue, Thu 11:00 AM',
            room: 'Lab 3',
            progress: 40,
            color: 'emerald',
            nextClass: 'Today, 11:00 AM'
        },
        {
            id: 'CS-303',
            name: 'Database Systems',
            semester: '3rd Semester',
            students: 42,
            schedule: 'Mon, Wed 02:00 PM',
            room: 'Room 201',
            progress: 55,
            color: 'amber',
            nextClass: 'Wednesday, 02:00 PM'
        },
        {
            id: 'CS-401',
            name: 'Advanced Networking',
            semester: '5th Semester',
            students: 25,
            schedule: 'Fri 10:00 AM',
            room: 'Lab 2',
            progress: 30,
            color: 'rose',
            nextClass: 'Friday, 10:00 AM'
        }
    ];

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-${course.color}-50 dark:bg-${course.color}-900/20`}>
                                    <Book className={`w-6 h-6 text-${course.color}-600 dark:text-${course.color}-400`} />
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{course.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{course.id} • {course.semester}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    {course.students} Students
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    {course.schedule}
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-500 dark:text-slate-400">Course Progress</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{course.progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-${course.color}-600 rounded-full transition-all duration-500`}
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    Next Class: <span className="font-medium text-slate-700 dark:text-slate-300">{course.nextClass}</span>
                                </div>
                                <button
                                    onClick={() => navigate(`/lecturer/courses/${course.id}`)}
                                    className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                >
                                    View Details
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LecturerCourses;
