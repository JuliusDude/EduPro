
import { GraduationCap, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', hours: 4 },
  { name: 'Tue', hours: 6 },
  { name: 'Wed', hours: 5 },
  { name: 'Thu', hours: 8 },
  { name: 'Fri', hours: 4 },
  { name: 'Sat', hours: 2 },
  { name: 'Sun', hours: 1 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Current GPA"
          value="3.8"
          icon={GraduationCap}
          color="indigo"
          trend={{ value: 2.4, isPositive: true }}
        />
        <StatCard
          label="Attendance"
          value="92%"
          icon={CheckCircle2}
          color="emerald"
          trend={{ value: 1.2, isPositive: true }}
        />
        <StatCard
          label="Pending Tasks"
          value="12"
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Courses"
          value="6"
          icon={BookOpen}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Hours Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Study Activity</h2>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-600 focus:ring-0">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Today's Schedule</h2>
          <div className="space-y-6">
            {[
              { time: '09:00 AM', subject: 'Data Structures', room: 'Lab 3', type: 'Lecture' },
              { time: '11:30 AM', subject: 'Web Development', room: 'Room 402', type: 'Lab' },
              { time: '02:00 PM', subject: 'Database Systems', room: 'Room 201', type: 'Lecture' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 2 && <div className="absolute left-[5px] top-8 bottom-[-24px] w-0.5 bg-slate-100"></div>}
                <div className="w-3 h-3 rounded-full bg-indigo-600 mt-1.5 shrink-0 ring-4 ring-indigo-50"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.subject}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.time} • {item.room}</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
