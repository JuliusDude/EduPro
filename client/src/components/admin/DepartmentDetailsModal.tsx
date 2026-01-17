import { X, Building2, Users, BookOpen, GraduationCap, Calendar } from 'lucide-react';

interface DepartmentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    department: any;
}

const DepartmentDetailsModal = ({ isOpen, onClose, department }: DepartmentDetailsModalProps) => {
    if (!isOpen || !department) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 transition-colors duration-300 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-6 left-6 flex items-end gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg">
                            <Building2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="text-white">
                            <h2 className="text-2xl font-bold">{department.name}</h2>
                            <p className="text-white/80 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Head: {department.head}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Courses</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{department.courses}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Students</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{department.students}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                                    <Users className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Lecturers</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{department.lecturers}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About Department</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {department.description}
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <span>Building A, Floor 3</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <span>Mon - Fri, 9:00 AM - 5:00 PM</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">New Course Added</p>
                                        <p className="text-xs text-slate-500">Advanced Machine Learning - 2 days ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Department Meeting</p>
                                        <p className="text-xs text-slate-500">Monthly review - 1 week ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetailsModal;
