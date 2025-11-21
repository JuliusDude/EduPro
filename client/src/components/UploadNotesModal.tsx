import { X, Upload, FileText, FolderPlus } from 'lucide-react';
import { useState } from 'react';

interface UploadNotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingFolders: { id: number; name: string }[];
}

const UploadNotesModal = ({ isOpen, onClose, existingFolders }: UploadNotesModalProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string>('');
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const targetFolder = isCreatingFolder ? newFolderName : selectedFolder;

        console.log('Uploading files:', files);
        console.log('To folder:', targetFolder);

        // Reset and close
        setFiles([]);
        setSelectedFolder('');
        setNewFolderName('');
        setIsCreatingFolder(false);
        onClose();
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload Notes</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add files to your collection</p>
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
                            Select Files
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="notes-upload"
                                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                            />
                            <label
                                htmlFor="notes-upload"
                                className="flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50"
                            >
                                <Upload className="w-5 h-5 text-slate-400" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload or drag and drop'}
                                </span>
                            </label>
                        </div>

                        {/* Selected Files List */}
                        {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            <div>
                                                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{file.name}</span>
                                                <span className="text-xs text-indigo-500 dark:text-indigo-500 ml-2">
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="p-1 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Folder Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Destination Folder
                        </label>

                        {!isCreatingFolder ? (
                            <div className="space-y-3">
                                <select
                                    value={selectedFolder}
                                    onChange={(e) => setSelectedFolder(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                                    required={!isCreatingFolder}
                                >
                                    <option value="">Select a folder...</option>
                                    {existingFolders.map(folder => (
                                        <option key={folder.id} value={folder.name}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => setIsCreatingFolder(true)}
                                    className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                >
                                    <FolderPlus className="w-4 h-4" />
                                    Create New Folder
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="Enter new folder name..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                                    required={isCreatingFolder}
                                    autoFocus
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreatingFolder(false);
                                        setNewFolderName('');
                                    }}
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                >
                                    ← Back to folder selection
                                </button>
                            </div>
                        )}
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
                            disabled={files.length === 0 || (!selectedFolder && !newFolderName)}
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Upload {files.length > 0 && `(${files.length})`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadNotesModal;
