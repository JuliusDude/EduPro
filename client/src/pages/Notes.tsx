import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import { Folder, FileText, MoreVertical, Upload, Search } from 'lucide-react';

const Notes = () => {
  const [activeTab, setActiveTab] = useState<'files' | 'chat'>('files');

  const folders = [
    { id: 1, name: 'Data Structures', files: 12, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 2, name: 'Web Development', files: 8, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 3, name: 'Database Systems', files: 15, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
  ];

  const recentFiles = [
    { id: 1, name: 'Lecture 4 - Trees.pdf', size: '2.4 MB', date: '2 hours ago' },
    { id: 2, name: 'React Hooks Cheatsheet.pdf', size: '1.1 MB', date: 'Yesterday' },
    { id: 3, name: 'Normalization Rules.docx', size: '850 KB', date: 'Oct 20' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Panel: File Explorer */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notes & Resources</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your course materials.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200 dark:shadow-none">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
          {folders.map(folder => (
            <div key={folder.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <Folder className={`w-8 h-8 ${folder.color} p-1.5 rounded-lg transition-colors`} />
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{folder.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{folder.files} files</p>
            </div>
          ))}
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
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 dark:text-slate-200 transition-all"
              />
            </div>
          </div>
          <div className="overflow-y-auto p-2">
            {recentFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{file.size} • {file.date}</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: AI Chat */}
      <div className="w-full lg:w-96 shrink-0">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Notes;
