import { GraduationCap, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { theme } = useTheme();

  const data = [
    { name: 'Mon', hours: 4 },
    { name: 'Tue', hours: 6 },
    { name: 'Wed', hours: 5 },
    { name: 'Thu', hours: 8 },
    { name: 'Fri', hours: 5 },
    { name: 'Sat', hours: 2 },
    { name: 'Sun', hours: 1 },
  ];

  // Dynamic Chart Colors
  const axisTickColor = theme === 'dark' ? '#94A3B8' : '#64748B'; // slate-400 vs slate-500
  const gridStrokeColor = theme === 'dark' ? '#334155' : '#E2E8F0'; // slate-700 vs slate-200
  const tooltipCursorFill = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const tooltipBgColor = theme === 'dark' ? '#1E293B' : '#FFFFFF';
  const tooltipTextColor = theme === 'dark' ? '#F8FAFC' : '#0F172A';

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors duration-300">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Current GPA"
          value="3.8"
          icon={GraduationCap}
          trend={{ value: 5, isPositive: true }}
          color="indigo"
        />
        <StatCard
          label="Attendance"
          value="92%"
          icon={CheckCircle2}
          trend={{ value: 2, isPositive: true }}
          color="emerald"
        />
        <StatCard
          label="Pending Tasks"
          value="4"
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Total Courses"
          value="6"
          icon={BookOpen}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Study Activity</h2>
            <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500/20">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStrokeColor} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: tooltipCursorFill }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: tooltipBgColor,
                    color: tooltipTextColor
                  }}
                />
                <Bar
                  dataKey="hours"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Today's Schedule</h2>
          <div className="space-y-6">
            {[
              { time: '09:00 AM', subject: 'Data Structures', type: 'Lecture', color: 'border-indigo-500' },
              { time: '11:00 AM', subject: 'Web Development', type: 'Lab', color: 'border-emerald-500' },
              { time: '02:00 PM', subject: 'Database Systems', type: 'Lecture', color: 'border-amber-500' },
            ].map((item, index) => (
              <div key={index} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 ${item.color} bg-white dark:bg-slate-900 z-10`}></div>
                  {index !== 2 && <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 absolute top-3"></div>}
                </div>
                <div className="pb-2">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">{item.time}</p>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.subject}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.type}</p>
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
