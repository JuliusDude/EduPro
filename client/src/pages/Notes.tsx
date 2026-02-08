import { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import UploadNotesModal from '../components/UploadNotesModal';
import { Folder, FileText, MoreVertical, Upload, Search, Trash2, Download, Plus } from 'lucide-react';
import studentApi from '../services/studentApi';

interface NoteFolder {
  id: string;
  name: string;
  color: string | null;
  filesCount: number;
  subfoldersCount: number;
}

interface Note {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  createdAt: string;
  noteType: string;
  subject: { id: string; name: string; code: string } | null;
  folder: { id: string; name: string; color: string | null } | null;
}

const Notes = () => {
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('indigo');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [foldersRes, notesRes] = await Promise.all([
        studentApi.getFolders(),
        studentApi.getNotes()
      ]);
      setFolders(foldersRes.data.folders);
      setNotes(notesRes.data.notes);
    } catch (err) {
      console.error('Failed to fetch notes data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await studentApi.createFolder(newFolderName, newFolderColor);
      setShowCreateFolderModal(false);
      setNewFolderName('');
      fetchData();
    } catch (err) {
      console.error('Failed to create folder:', err);
      alert('Failed to create folder');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await studentApi.deleteNote(noteId);
      fetchData();
    } catch (err) {
      console.error('Failed to delete note:', err);
      alert('Failed to delete note');
    }
  };

  const handleDownloadNote = async (note: Note) => {
    if (!note.fileUrl) return;
    try {
      const blob = await studentApi.downloadNote(note.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.fileName || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download:', err);
      alert('Failed to download file');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFolderColor = (color: string | null) => {
    const colors: Record<string, string> = {
      indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
      emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
      amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
      rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20',
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    };
    return colors[color || 'indigo'] || colors.indigo;
  };

  const filteredNotes = notes.filter(note =>
    searchQuery === '' ||
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Panel: File Explorer */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notes & Resources</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your course materials.</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200 dark:shadow-none"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
          {folders.map(folder => (
            <div key={folder.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <Folder className={`w-8 h-8 ${getFolderColor(folder.color)} p-1.5 rounded-lg transition-colors`} />
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{folder.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{folder.filesCount} files</p>
            </div>
          ))}

          {/* Add Folder Card */}
          <button
            onClick={() => setShowCreateFolderModal(true)}
            className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">New Folder</span>
          </button>
        </div>

        {/* Recent Files List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Files</h3>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 dark:text-slate-200 transition-all"
              />
            </div>
          </div>
          <div className="overflow-y-auto p-2 flex-1">
            {filteredNotes.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400 text-sm">
                No notes found
              </div>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{note.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatFileSize(note.fileSize)} • {formatDate(note.createdAt)}
                        {note.subject && ` • ${note.subject.name}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {note.fileUrl && (
                      <button
                        onClick={() => handleDownloadNote(note)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {note.noteType === 'PERSONAL_NOTE' && (
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: AI Chat */}
      <div className="w-full lg:w-96 shrink-0">
        <ChatInterface />
      </div>

      {/* Upload Modal */}
      <UploadNotesModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          fetchData();
        }}
        existingFolders={folders.map(f => ({ id: f.id, name: f.name, files: f.filesCount, color: f.color || 'indigo' }))}
      />

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create New Folder</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="My Notes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {['indigo', 'emerald', 'amber', 'rose', 'blue'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewFolderColor(color)}
                      className={`w-8 h-8 rounded-full ${getFolderColor(color)} ${newFolderColor === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
