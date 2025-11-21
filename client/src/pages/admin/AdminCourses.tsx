import { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, BookOpen, Users, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

const AdminCourses = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'archived'>('all');

    const courses = [
        {
            id: 1,
            code: 'CS-301',
            name: 'Advanced Data Structures',
            department: 'Computer Science',
            lecturer: 'Dr. Sarah Smith',
            students: 45,
            credits: 4,
            semester: 'Fall 2024',
            status: 'active'
        },
        {
            id: 2,
            code: 'CS-302',
            name: 'Database Systems',
            department: 'Computer Science',
            lecturer: 'Prof. Alan Turing',
            students: 52,
            credits: 3,
            semester: 'Fall 2024',
            status: 'active'
        },
        {
            id: 3,
            code: 'ENG-101',
            name: 'Technical Writing',
            department: 'English',
            lecturer: 'Ms. Emily Bronte',
            students: 30,
            credits: 2,
            semester: 'Fall 2024',
            status: 'active'
        },
        {
            id: 4,
            code: 'CS-201',
            name: 'Intro to Programming',
            department: 'Computer Science',
            lecturer: 'Dr. Sarah Smith',
            students: 60,
            credits: 4,
            semester: 'Spring 2024',
            status: 'archived'
        }
    ];

    const filteredCourses = activeTab === 'all' ? courses : courses.filter(course => course.status === activeTab);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage academic courses</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200 dark:shadow-none">
                    <Plus className="w-4 h-4" />
                    Create Course
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex gap-2">
                        {['all', 'active', 'archived'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                            />
                        </div>
                        <button className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{course.code}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{course.department}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-1" title={course.name}>
                                {course.name}
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                    <Users className="w-4 h-4 mr-3 text-slate-400" />
                                    {course.lecturer}
                                </div>
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                    <Calendar className="w-4 h-4 mr-3 text-slate-400" />
                                    {course.semester}
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                                        <Users className="w-4 h-4 mr-3 text-slate-400" />
                                        {course.students} Students
                                    </div>
                                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                        {course.credits} Credits
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm font-medium">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCourses;
