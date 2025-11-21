import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, FileText, Calendar, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

import CreateAssignmentModal from '../../components/CreateAssignmentModal';

const LecturerAssignments = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'active' | 'graded' | 'drafts'>('active');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleCreateAssignment = (assignmentData: any) => {
        console.log('Creating assignment:', assignmentData);
        // Here you would typically make an API call to save the assignment
        setIsCreateModalOpen(false);
    };

    const assignments = [
        {
            id: 1,
            title: 'Data Structures Implementation',
            course: 'CS-301',
            dueDate: '2024-11-25',
            submitted: 28,
            total: 45,
            status: 'active',
            type: 'Lab Report'
        },
        {
            id: 2,
            title: 'Database Normalization Project',
            course: 'CS-303',
            dueDate: '2024-11-20',
            submitted: 40,
            total: 42,
            status: 'active',
            type: 'Project'
        },
        {
            id: 3,
            title: 'React Component Lifecycle',
            course: 'CS-302',
            dueDate: '2024-11-15',
            submitted: 38,
            total: 38,
            status: 'graded',
            type: 'Quiz'
        },
        {
            id: 4,
            title: 'Network Protocols Essay',
            course: 'CS-401',
            dueDate: '2024-12-01',
            submitted: 0,
            total: 25,
            status: 'drafts',
            type: 'Essay'
        }
    ];

    const filteredAssignments = assignments.filter(a => a.status === activeTab);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage course assignments</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200 dark:shadow-none"
                    >
                        <Plus className="w-4 h-4" />
                        Create Assignment
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    {['active', 'graded', 'drafts'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
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
                            placeholder="Search assignments..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                        />
                    </div>
                    <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Assignments List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Assignment</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Course</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Due Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Submissions</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredAssignments.map((assignment) => (
                                <tr key={assignment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{assignment.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{assignment.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                            {assignment.course}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(assignment.dueDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-indigo-600 h-full rounded-full"
                                                    style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                {assignment.submitted}/{assignment.total}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {assignment.status === 'active' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                                <Clock className="w-3 h-3" /> Active
                                            </span>
                                        )}
                                        {assignment.status === 'graded' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                                <CheckCircle className="w-3 h-3" /> Graded
                                            </span>
                                        )}
                                        {assignment.status === 'drafts' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                <AlertCircle className="w-3 h-3" /> Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/lecturer/assignments/${assignment.id}`)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateAssignmentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateAssignment}
            />
        </div>
    );
};

export default LecturerAssignments;
