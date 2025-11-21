import { useState } from 'react';
import { Search, Plus, MoreVertical, Building2, Users, BookOpen, Edit2, Trash2, ArrowRight } from 'lucide-react';

const AdminDepartments = () => {
    const departments = [
        {
            id: 1,
            name: 'Computer Science',
            head: 'Dr. Alan Turing',
            courses: 12,
            students: 450,
            lecturers: 15,
            description: 'Software Engineering, AI, and Data Science'
        },
        {
            id: 2,
            name: 'Mathematics',
            head: 'Dr. Katherine Johnson',
            courses: 8,
            students: 320,
            lecturers: 10,
            description: 'Pure and Applied Mathematics'
        },
        {
            id: 3,
            name: 'Physics',
            head: 'Dr. Richard Feynman',
            courses: 10,
            students: 280,
            lecturers: 12,
            description: 'Theoretical and Experimental Physics'
        },
        {
            id: 4,
            name: 'Business Administration',
            head: 'Dr. Peter Drucker',
            courses: 15,
            students: 600,
            lecturers: 20,
            description: 'Management, Finance, and Marketing'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Departments</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage academic departments and faculties</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200 dark:shadow-none">
                    <Plus className="w-4 h-4" />
                    Add Department
                </button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                    />
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map((dept) => (
                    <div key={dept.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{dept.name}</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Head: {dept.head}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-2">
                                {dept.description}
                            </p>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-1">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{dept.courses}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Courses</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{dept.students}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Students</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{dept.lecturers}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Lecturers</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
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

export default AdminDepartments;
