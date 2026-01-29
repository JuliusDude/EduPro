import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, BookOpen, Users, Calendar, Clock, Edit2, Trash2, UserPlus } from 'lucide-react';
import AddCourseModal from '../../components/admin/AddCourseModal';
import ManageLecturersModal from '../../components/admin/ManageLecturersModal';
import ViewStudentsModal from '../../components/admin/ViewStudentsModal';
import api from '../../services/api';

const AdminCourses = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'archived'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState<any>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isManageLecturersModalOpen, setIsManageLecturersModalOpen] = useState(false);
    const [managingCourse, setManagingCourse] = useState<any>(null);
    const [isViewStudentsModalOpen, setIsViewStudentsModalOpen] = useState(false);
    const [viewingCourse, setViewingCourse] = useState<any>(null);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/courses');
            setCourses(response.data.data.courses);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleAddCourse = async (courseData: any) => {
        try {
            if (editingCourse) {
                await api.put(`/admin/courses/${editingCourse.id}`, courseData);
            } else {
                await api.post('/admin/courses', courseData);
            }
            fetchCourses();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save course:', error);
        }
    };

    const handleDeleteCourse = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/admin/courses/${id}`);
                fetchCourses();
            } catch (error) {
                console.error('Failed to delete course:', error);
            }
        }
    };

    const handleEditClick = (course: any) => {
        setEditingCourse(course);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingCourse(null);
    };

    const filteredCourses = activeTab === 'all' ? courses : courses.filter(course => course.status === activeTab);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage academic courses</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCourse(null);
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200 dark:shadow-none"
                >
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
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === course.id ? null : course.id)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {activeMenu === course.id && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 z-10 overflow-hidden">
                                            <button
                                                onClick={() => {
                                                    handleEditClick(course);
                                                    setActiveMenu(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Course
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDeleteCourse(course.id);
                                                    setActiveMenu(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Course
                                            </button>
                                        </div>
                                    )}
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

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                <button
                                    onClick={() => {
                                        setViewingCourse(course);
                                        setIsViewStudentsModalOpen(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-sm font-medium"
                                >
                                    <Users className="w-4 h-4" />
                                    View Students ({course.students})
                                </button>
                                <button
                                    onClick={() => {
                                        setManagingCourse(course);
                                        setIsManageLecturersModalOpen(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors text-sm font-medium"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Assign & Manage Lecturers
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddCourseModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                onAdd={handleAddCourse}
                initialData={editingCourse}
            />

            <ManageLecturersModal
                isOpen={isManageLecturersModalOpen}
                onClose={() => {
                    setIsManageLecturersModalOpen(false);
                    setManagingCourse(null);
                    fetchCourses();
                }}
                course={managingCourse}
            />

            <ViewStudentsModal
                isOpen={isViewStudentsModalOpen}
                onClose={() => {
                    setIsViewStudentsModalOpen(false);
                    setViewingCourse(null);
                }}
                course={viewingCourse}
            />
        </div>
    );
};

export default AdminCourses;
