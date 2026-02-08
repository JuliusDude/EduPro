import { useState, useEffect } from 'react';
import AttendanceCard from '../components/AttendanceCard';
import { Filter, Settings } from 'lucide-react';
import studentApi from '../services/studentApi';

interface AttendanceSubject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  attended: number;
  total: number;
  percentage: number;
  targetPercentage: number;
  classesNeeded: number;
  canMiss: number;
  status: 'good' | 'warning' | 'danger';
}

const Attendance = () => {
  const [subjects, setSubjects] = useState<AttendanceSubject[]>([]);
  const [targetAttendance, setTargetAttendance] = useState(75);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [newTarget, setNewTarget] = useState(75);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await studentApi.getAttendance();
      setSubjects(response.data.subjects);
      setTargetAttendance(response.data.targetAttendance);
      setNewTarget(response.data.targetAttendance);
    } catch (err: any) {
      console.error('Failed to fetch attendance:', err);
      setError(err.response?.data?.message || 'Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTarget = async () => {
    try {
      await studentApi.updateTargetAttendance(newTarget);
      setTargetAttendance(newTarget);
      setShowTargetModal(false);
      fetchAttendance(); // Refresh to recalculate classes needed/can miss
    } catch (err: any) {
      console.error('Failed to update target:', err);
      alert(err.response?.data?.message || 'Failed to update target');
    }
  };

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
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Attendance Tracker</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your attendance and track your eligibility.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowTargetModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            <Settings className="w-4 h-4" />
            Target: {targetAttendance}%
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400">No enrolled subjects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <AttendanceCard
              key={subject.subjectId}
              subject={subject.subjectName}
              code={subject.subjectCode}
              attended={subject.attended}
              total={subject.total}
              targetPercentage={subject.targetPercentage}
            />
          ))}
        </div>
      )}

      {/* Target Attendance Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Set Target Attendance</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Target Percentage
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newTarget}
                onChange={(e) => setNewTarget(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Recommended: 75% minimum for exam eligibility
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTargetModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTarget}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
