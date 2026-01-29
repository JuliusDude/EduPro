import { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, User, BookOpen } from 'lucide-react';
import api from '../../services/api';

interface ManageLecturersModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: any;
}

const ManageLecturersModal = ({ isOpen, onClose, course }: ManageLecturersModalProps) => {
    const [lecturers, setLecturers] = useState<any[]>([]);
    const [availableLecturers, setAvailableLecturers] = useState<any[]>([]);
    const [selectedLecturerId, setSelectedLecturerId] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && course) {
            fetchCourseDetails();
            fetchAvailableLecturers();
            setSubjectName(course.name); // Default subject name to course name
        }
    }, [isOpen, course]);

    const fetchCourseDetails = async () => {
        try {
            const response = await api.get(`/admin/courses/${course.id}`);
            const subjects = response.data.data.course.subjects || [];
            setLecturers(subjects.map((s: any) => ({
                id: s.lecturer?.id,
                name: s.lecturer?.user ? `${s.lecturer.user.firstName} ${s.lecturer.user.lastName}` : 'Unknown',
                subjectId: s.id,
                subjectName: s.name
            })).filter((l: any) => l.id));
        } catch (error) {
            console.error('Failed to fetch course details:', error);
        }
    };

    const fetchAvailableLecturers = async () => {
        try {
            const response = await api.get('/admin/users?role=LECTURER');
            const users = response.data.data.users || [];
            const validLecturers = users.filter((u: any) => u.lecturer?.id);
            setAvailableLecturers(validLecturers);
        } catch (error) {
            console.error('Failed to fetch lecturers:', error);
        }
    };

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLecturerId) return;

        setIsLoading(true);
        try {
            await api.post(`/admin/courses/${course.id}/subjects`, {
                lecturerId: selectedLecturerId,
                name: subjectName || course.name,
                code: `${course.code}-${Math.floor(Math.random() * 1000)}`
            });
            fetchCourseDetails();
            setSelectedLecturerId('');
            setSubjectName(course.name);
        } catch (error) {
            console.error('Failed to assign lecturer:', error);
            alert('Failed to assign lecturer. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (subjectId: string) => {
        if (!window.confirm('Are you sure? This will remove the subject and lecturer assignment.')) return;
        try {
            await api.delete(`/admin/courses/${course.id}/subjects/${subjectId}`);
            fetchCourseDetails();
        } catch (error) {
            console.error('Failed to remove lecturer:', error);
        }
    };

    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Lecturers</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{course.name} ({course.code})</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <form onSubmit={handleAssign} className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Assign New Lecturer
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Lecturer</label>
                                <select
                                    required
                                    value={selectedLecturerId}
                                    onChange={(e) => setSelectedLecturerId(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                                >
                                    <option value="">Select a lecturer...</option>
                                    {availableLecturers.map((lecturer: any) => (
                                        <option key={lecturer.lecturer.id} value={lecturer.lecturer.id}>
                                            {lecturer.firstName} {lecturer.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Subject/Module Name</label>
                                <input
                                    type="text"
                                    required
                                    value={subjectName}
                                    onChange={(e) => setSubjectName(e.target.value)}
                                    placeholder="e.g. Theory, Lab, Section A"
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !selectedLecturerId}
                                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Assigning...' : 'Assign Lecturer'}
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Current Lecturers
                        </h3>

                        {lecturers.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-4">
                                No lecturers assigned yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {lecturers.map((lecturer) => (
                                    <div key={lecturer.subjectId} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                                                {lecturer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{lecturer.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3" />
                                                    {lecturer.subjectName}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(lecturer.subjectId)}
                                            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Remove assignment"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageLecturersModal;
