import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Users, Clock, FileText, Plus, Trash2, Loader2, CheckCircle, Circle, FileEdit, X, Upload, Download } from 'lucide-react';
import { lecturerApi } from '../../services/lecturerApi';

interface Note {
    id: string;
    title: string;
    description: string;
    fileUrl?: string;
    fileName?: string;
    isPublic: boolean;
    createdAt: string;
}

interface SubjectDetails {
    id: string;
    code: string;
    name: string;
    course: string;
    department: string;
    semester: number;
    weeklyHours: number;
    totalHours: number;
    roomNumber: string | null;
    enrolledStudents: number;
    syllabusCompleted?: boolean;
    timetable: {
        id: string;
        day: string;
        startTime: string;
        endTime: string;
        room: string | null;
        type: string;
    }[];
    assignments: {
        id: string;
        title: string;
        dueDate: string;
        status: string;
        totalMarks: number;
        submissions: number;
    }[];
}

const LecturerCourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments' | 'notes'>('overview');
    const [subject, setSubject] = useState<SubjectDetails | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [syllabusCompleted, setSyllabusCompleted] = useState(false);
    const [togglingStatus, setTogglingStatus] = useState(false);

    // Note modal state
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [noteForm, setNoteForm] = useState({ title: '', description: '', isPublic: true });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [savingNote, setSavingNote] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [subjectData, studentsData, notesData] = await Promise.all([
                    lecturerApi.getSubjectById(id),
                    lecturerApi.getSubjectStudents(id),
                    lecturerApi.getSubjectNotes(id).catch(() => [])
                ]);
                setSubject(subjectData);
                setStudents(studentsData);
                setNotes(notesData);
                setSyllabusCompleted(subjectData.syllabusCompleted || false);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch subject data:', err);
                setError(err.response?.data?.message || 'Failed to load subject details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleToggleSyllabus = async () => {
        if (!id) return;
        try {
            setTogglingStatus(true);
            const newStatus = !syllabusCompleted;
            await lecturerApi.toggleSyllabusStatus(id, newStatus);
            setSyllabusCompleted(newStatus);
        } catch (err: any) {
            console.error('Failed to toggle syllabus status:', err);
            alert('Failed to update syllabus status');
        } finally {
            setTogglingStatus(false);
        }
    };

    const handleAddNote = async () => {
        if (!id || !noteForm.title.trim()) return;
        try {
            setSavingNote(true);
            const result = await lecturerApi.addSubjectNote(id, {
                ...noteForm,
                file: selectedFile || undefined
            });
            setNotes([{ ...result.data, createdAt: new Date().toISOString() }, ...notes]);
            setNoteForm({ title: '', description: '', isPublic: true });
            setSelectedFile(null);
            setIsNoteModalOpen(false);
        } catch (err: any) {
            console.error('Failed to add note:', err);
            alert('Failed to add note');
        } finally {
            setSavingNote(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Only PDF files are allowed');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!id || !confirm('Are you sure you want to delete this note?')) return;
        try {
            await lecturerApi.deleteSubjectNote(id, noteId);
            setNotes(notes.filter(n => n.id !== noteId));
        } catch (err: any) {
            console.error('Failed to delete note:', err);
            alert('Failed to delete note');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error || !subject) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl">
                <p>{error || 'Subject not found'}</p>
            </div>
        );
    }

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
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{subject.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{subject.code} • Semester {subject.semester}</p>
                </div>
                {/* Syllabus Status Toggle */}
                <button
                    onClick={handleToggleSyllabus}
                    disabled={togglingStatus}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${syllabusCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                >
                    {togglingStatus ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : syllabusCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <Circle className="w-5 h-5" />
                    )}
                    {syllabusCompleted ? 'Syllabus Completed' : 'Syllabus In Progress'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                {(['overview', 'students', 'assignments', 'notes'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
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
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Course Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Course</p>
                                        <p className="font-medium text-slate-900 dark:text-white">{subject.course}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Department</p>
                                        <p className="font-medium text-slate-900 dark:text-white">{subject.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Weekly Hours</p>
                                        <p className="font-medium text-slate-900 dark:text-white">{subject.weeklyHours} hours</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Hours</p>
                                        <p className="font-medium text-slate-900 dark:text-white">{subject.totalHours} hours</p>
                                    </div>
                                </div>
                            </div>

                            {subject.timetable.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Schedule</h3>
                                    <div className="space-y-3">
                                        {subject.timetable.map((slot) => (
                                            <div key={slot.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                                <div className="w-24 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {slot.day}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {slot.startTime} - {slot.endTime}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {slot.room || 'No room'} • {slot.type}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Semester</p>
                                            <p className="font-medium">Semester {subject.semester}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <Users className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Enrolled Students</p>
                                            <p className="font-medium">{subject.enrolledStudents} Students</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <Book className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Room</p>
                                            <p className="font-medium">{subject.roomNumber || 'Not assigned'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        {students.length === 0 ? (
                            <div className="p-12 text-center">
                                <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400">No students enrolled</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Attendance</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Assignments</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {students.map((student) => (
                                        <tr key={student.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                {student.firstName} {student.lastName}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{student.email}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{student.attendancePercentage}%</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{student.assignmentCompletion}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-4">
                        {subject.assignments.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400">No assignments yet</p>
                            </div>
                        ) : (
                            subject.assignments.map((assignment) => (
                                <div key={assignment.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{assignment.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Due: {new Date(assignment.dueDate).toLocaleDateString()} • {assignment.submissions} submissions
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/lecturer/assignments/${assignment.id}`)}
                                        className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                    >
                                        View Submissions
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="space-y-4">
                        {/* Add Note Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsNoteModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Course Note
                            </button>
                        </div>

                        {/* Notes List */}
                        {notes.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                <FileEdit className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400">No course notes yet</p>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Add notes for students to access</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notes.map((note) => (
                                    <div key={note.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{note.title}</h4>
                                                    {note.isPublic && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                                            Visible to Students
                                                        </span>
                                                    )}
                                                </div>
                                                {note.description && (
                                                    <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap">{note.description}</p>
                                                )}
                                                {note.fileUrl && note.fileName && (
                                                    <a
                                                        href={`http://localhost:5000${note.fileUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        {note.fileName}
                                                    </a>
                                                )}
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                                    Added {new Date(note.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Note Modal */}
            {isNoteModalOpen && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Course Note</h2>
                            <button
                                onClick={() => setIsNoteModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={noteForm.title}
                                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                                    placeholder="e.g., Chapter 5 Summary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Content</label>
                                <textarea
                                    value={noteForm.description}
                                    onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all resize-none"
                                    placeholder="Enter note content..."
                                />
                            </div>
                            {/* PDF Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    PDF Attachment (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label
                                        htmlFor="pdf-upload"
                                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${selectedFile
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {selectedFile ? (
                                            <>
                                                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-xs">
                                                    {selectedFile.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); setSelectedFile(null); }}
                                                    className="ml-2 p-1 text-slate-400 hover:text-rose-500 rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5 text-slate-400" />
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Click to upload PDF (max 10MB)
                                                </span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={noteForm.isPublic}
                                    onChange={(e) => setNoteForm({ ...noteForm, isPublic: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-300">Make visible to students</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setIsNoteModalOpen(false)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddNote}
                                disabled={savingNote || !noteForm.title.trim()}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {savingNote && <Loader2 className="w-4 h-4 animate-spin" />}
                                Add Note
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LecturerCourseDetails;
