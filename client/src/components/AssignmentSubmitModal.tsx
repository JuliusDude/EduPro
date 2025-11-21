import { X, Upload, FileText } from 'lucide-react';
import { useState } from 'react';

interface AssignmentSubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignmentTitle: string;
}

const AssignmentSubmitModal = ({ isOpen, onClose, assignmentTitle }: AssignmentSubmitModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submission logic here
        console.log('Submitting:', { file, note });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Submit Assignment</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{assignmentTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Upload File
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="hidden"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,.txt"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50"
                            >
                                <Upload className="w-5 h-5 text-slate-400" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {file ? file.name : 'Click to upload or drag and drop'}
                                </span>
                            </label>
                        </div>
                        {file && (
                            <div className="mt-3 flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-lg">
                                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{file.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={4}
                            placeholder="Add any comments or notes for your instructor..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!file}
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Assignment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignmentSubmitModal;
