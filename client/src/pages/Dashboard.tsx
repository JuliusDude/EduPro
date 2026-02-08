import { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import studentApi from '../services/studentApi';

interface DashboardData {
  gpa: number;
  attendancePercentage: number;
  totalCourses: number;
  pendingAssignments: number;
  todaySchedule: {
    time: string;
    subject: string;
    type: string;
    room: string | null;
  }[];
  upcomingAssignments: {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
  }[];
}

const Dashboard = () => {
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await studentApi.getDashboard();
        setDashboardData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Mock study activity data (could be replaced with real data later)
  const studyData = [
    { name: 'Mon', hours: 4 },
    { name: 'Tue', hours: 6 },
    { name: 'Wed', hours: 5 },
    { name: 'Thu', hours: 8 },
    { name: 'Fri', hours: 5 },
    { name: 'Sat', hours: 2 },
    { name: 'Sun', hours: 1 },
  ];

  // Dynamic Chart Colors
  const axisTickColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridStrokeColor = theme === 'dark' ? '#334155' : '#E2E8F0';
  const tooltipCursorFill = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const tooltipBgColor = theme === 'dark' ? '#1E293B' : '#FFFFFF';
  const tooltipTextColor = theme === 'dark' ? '#F8FAFC' : '#0F172A';

  const getScheduleColor = (index: number) => {
    const colors = ['border-indigo-500', 'border-emerald-500', 'border-amber-500', 'border-rose-500', 'border-blue-500'];
    return colors[index % colors.length];
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
          value={dashboardData?.gpa?.toFixed(1) || '0.0'}
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          label="Attendance"
          value={`${dashboardData?.attendancePercentage || 0}%`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Pending Tasks"
          value={String(dashboardData?.pendingAssignments || 0)}
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Total Courses"
          value={String(dashboardData?.totalCourses || 0)}
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
              <BarChart data={studyData}>
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
            {dashboardData?.todaySchedule && dashboardData.todaySchedule.length > 0 ? (
              dashboardData.todaySchedule.map((item, index) => (
                <div key={index} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${getScheduleColor(index)} bg-white dark:bg-slate-900 z-10`}></div>
                    {index !== dashboardData.todaySchedule.length - 1 && <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 absolute top-3"></div>}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">{item.time}</p>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.subject}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.type}{item.room ? ` • ${item.room}` : ''}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No classes scheduled for today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
