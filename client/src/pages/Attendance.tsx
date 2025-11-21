import AttendanceCard from '../components/AttendanceCard';
import { Filter } from 'lucide-react';

const Attendance = () => {
  const subjects = [
    { id: 1, subject: 'Data Structures & Algorithms', code: 'CS-301', attended: 24, total: 30 },
    { id: 2, subject: 'Web Development', code: 'CS-304', attended: 18, total: 20 },
    { id: 3, subject: 'Database Management', code: 'CS-302', attended: 15, total: 25 },
    { id: 4, subject: 'Computer Networks', code: 'CS-303', attended: 28, total: 30 },
    { id: 5, subject: 'Software Engineering', code: 'CS-305', attended: 20, total: 28 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Attendance Tracker</h1>
          <p className="text-sm text-slate-500">Manage your attendance and track your eligibility.</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors font-medium text-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <AttendanceCard
            key={subject.id}
            subject={subject.subject}
            code={subject.code}
            attended={subject.attended}
            total={subject.total}
            targetPercentage={75}
          />
        ))}
      </div>
    </div>
  );
};

export default Attendance;
