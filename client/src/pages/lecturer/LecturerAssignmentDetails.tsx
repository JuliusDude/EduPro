import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, FileText, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import GradingModal from '../../components/GradingModal';

const LecturerAssignmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);

    // Mock Data
    const assignment = {
        id: id,
        title: 'Data Structures Implementation',
        course: 'CS-301',
        dueDate: '2024-11-25',
        totalPoints: 100,
        description: 'Implement a Binary Search Tree with insertion, deletion, and traversal methods.',
        stats: {
            submitted: 28,
            graded: 15,
            pending: 13,
            total: 30
        }
    };

    const [submissions, setSubmissions] = useState([
        {
            id: 'SUB-001',
            studentId: 'S001',
            studentName: 'John Doe',
            submittedDate: '2024-11-24 14:30',
            status: 'graded',
            grade: 92,
            feedback: 'Excellent work on the traversal algorithms!',
            fileUrl: '#',
            fileName: 'bst_implementation.pdf'
        },
        {
            id: 'SUB-002',
            studentId: 'S002',
            studentName: 'Jane Smith',
            submittedDate: '2024-11-25 09:15',
            status: 'pending',
            grade: undefined,
            feedback: '',
            fileUrl: '#',
            fileName: 'assignment_3.pdf'
        },
        {
            id: 'SUB-003',
            studentId: 'S003',
            studentName: 'Mike Johnson',
            submittedDate: '2024-11-25 11:45',
            status: 'pending',
            grade: undefined,
            feedback: '',
            fileUrl: '#',
            fileName: 'cs301_lab3.pdf'
        },
        {
            id: 'SUB-004',
            studentId: 'S004',
            studentName: 'Sarah Williams',
            submittedDate: '2024-11-23 16:20',
            status: 'graded',
            grade: 88,
            feedback: 'Good job, but check edge cases for deletion.',
            fileUrl: '#',
            fileName: 'bst_sarah.pdf'
        }
    ]);

    const handleGradeClick = (submission: any) => {
        setSelectedSubmission(submission);
        setIsGradingModalOpen(true);
    };

    const handleSaveGrade = (grade: number, feedback: string) => {
        setSubmissions(submissions.map(sub =>
            sub.id === selectedSubmission.id
                ? { ...sub, grade, feedback, status: 'graded' }
                : sub
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/lecturer/assignments')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{assignment.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{assignment.course} • Due {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{assignment.stats.total}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Submitted</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{assignment.stats.submitted}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Graded</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{assignment.stats.graded}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{assignment.stats.pending}</p>
                </div>
            </div>

            {/* Submissions List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Submissions</h2>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                            />
                        </div>
                        <button className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Submitted Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">File</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Grade</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {submissions.map((submission) => (
                                <tr key={submission.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                                {submission.studentName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{submission.studentName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{submission.studentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {submission.submittedDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                            <FileText className="w-4 h-4" />
                                            {submission.fileName}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {submission.status === 'graded' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle className="w-3 h-3" /> Graded
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                                <Clock className="w-3 h-3" /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                        {submission.grade !== undefined ? `${submission.grade}/100` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleGradeClick(submission)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                                        >
                                            {submission.status === 'graded' ? 'Edit Grade' : 'Grade'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <GradingModal
                isOpen={isGradingModalOpen}
                onClose={() => setIsGradingModalOpen(false)}
                submission={selectedSubmission}
                onSave={handleSaveGrade}
            />
        </div>
    );
};

export default LecturerAssignmentDetails;
