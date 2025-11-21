import { useState } from 'react';
import { X, FileText, Download, Save } from 'lucide-react';

interface GradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: {
        id: string;
        studentName: string;
        submittedDate: string;
        fileUrl: string;
        fileName: string;
        grade?: number;
        feedback?: string;
    } | null;
    onSave: (grade: number, feedback: string) => void;
}

const GradingModal = ({ isOpen, onClose, submission, onSave }: GradingModalProps) => {
    const [grade, setGrade] = useState<number | ''>(submission?.grade || '');
    const [feedback, setFeedback] = useState(submission?.feedback || '');

    if (!isOpen || !submission) return null;

    const handleSave = () => {
        if (typeof grade === 'number') {
            onSave(grade, feedback);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Grade Submission</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {submission.studentName} • {submission.submittedDate}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* File Preview / Download */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">{submission.fileName}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">2.4 MB • PDF</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                    </div>

                    {/* Grading Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Grade (out of 100)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={grade}
                                onChange={(e) => setGrade(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                                placeholder="Enter grade..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Feedback / Comments
                            </label>
                            <textarea
                                rows={4}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all resize-none"
                                placeholder="Add your feedback here..."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        <Save className="w-4 h-4" />
                        Save Grade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GradingModal;
