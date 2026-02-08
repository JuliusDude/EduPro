import { useState, useEffect } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import { Search, Upload, X, FileText } from 'lucide-react';
import studentApi from '../services/studentApi';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectCode: string;
  dueDate: string;
  totalMarks: number;
  attachments: any[];
  status: 'pending' | 'submitted' | 'graded' | 'overdue' | 'late';
  submission: {
    id: string;
    submittedAt: string;
    grade: number | null;
    feedback: string | null;
    files: any[];
  } | null;
}

const Assignments = () => {
  const [filter, setFilter] = useState('all');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Submit modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitFiles, setSubmitFiles] = useState<File[]>([]);
  const [submitRemarks, setSubmitRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const response = await studentApi.getAssignments();
      setAssignments(response.data.assignments);
    } catch (err: any) {
      console.error('Failed to fetch assignments:', err);
      setError(err.response?.data?.message || 'Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || submitFiles.length === 0) return;

    try {
      setIsSubmitting(true);
      await studentApi.submitAssignment(selectedAssignment.id, submitFiles, submitRemarks);
      setShowSubmitModal(false);
      setSelectedAssignment(null);
      setSubmitFiles([]);
      setSubmitRemarks('');
      fetchAssignments(); // Refresh list
    } catch (err: any) {
      console.error('Failed to submit:', err);
      alert(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSubmitModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSubmitFiles(Array.from(e.target.files));
    }
  };

  const filteredAssignments = assignments
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a =>
      searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const tabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'graded', label: 'Graded' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Assignments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your academic tasks</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-center w-full lg:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 dark:text-slate-200 transition-all"
            />
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1 md:flex-none ${filter === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400">No assignments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map(assignment => (
            <div key={assignment.id} className="relative">
              <AssignmentCard
                id={Number(assignment.id)}
                title={assignment.title}
                subject={assignment.subject}
                dueDate={new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                status={assignment.status}
                description={assignment.description}
              />
              {(assignment.status === 'pending' || assignment.status === 'overdue') && (
                <button
                  onClick={() => openSubmitModal(assignment)}
                  className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  Submit
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Submit Assignment</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedAssignment.title}</p>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Upload Files (Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
                />
                {submitFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {submitFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <FileText className="w-4 h-4" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={submitRemarks}
                  onChange={(e) => setSubmitRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                  placeholder="Any notes for your submission..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitFiles.length === 0 || isSubmitting}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
