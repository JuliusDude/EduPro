import { X, Mail, Phone, Hash, Calendar, MapPin, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

interface StudentProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: {
        id: string;
        name: string;
        email: string;
        course?: string;
        attendance?: number;
        grade?: string;
        assignments?: number;
        status?: string;
    } | null;
}

const StudentProfileModal = ({ isOpen, onClose, student }: StudentProfileModalProps) => {
    if (!isOpen || !student) return null;

    // Mock additional data
    const studentDetails = {
        ...student,
        phone: '+1 (555) 987-6543',
        dob: '2002-08-20',
        address: '456 College Dorms, Campus City, ST 12345',
        enrollmentYear: '2022',
        semester: '4th Semester',
        department: 'Computer Science'
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 transition-colors duration-300 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 z-10 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold mb-4">
                            {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{student.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{studentDetails.department} • {studentDetails.semester}</p>

                        <div className="flex gap-2 mt-3">
                            {student.status === 'active' && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                    Active Student
                                </span>
                            )}
                            {student.status === 'at-risk' && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                    At Risk
                                </span>
                            )}
                            {student.status === 'critical' && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                                    Critical Status
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className="flex justify-center mb-2 text-indigo-600 dark:text-indigo-400">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{student.grade || 'N/A'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Current Grade</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className="flex justify-center mb-2 text-emerald-600 dark:text-emerald-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{student.attendance}%</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Attendance</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className="flex justify-center mb-2 text-amber-600 dark:text-amber-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{student.assignments}%</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Assignments</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                            Contact Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                                    <p className="text-sm font-medium">{student.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Phone className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                                    <p className="text-sm font-medium">{studentDetails.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Hash className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Student ID</p>
                                    <p className="text-sm font-medium">{student.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Date of Birth</p>
                                    <p className="text-sm font-medium">{studentDetails.dob}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300 pt-2">
                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Address</p>
                                <p className="text-sm font-medium">{studentDetails.address}</p>
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

export default StudentProfileModal;
