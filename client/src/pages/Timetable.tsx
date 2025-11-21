import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

const Timetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '12:00 - 01:00',
        '01:00 - 02:00',
        '02:00 - 03:00',
        '03:00 - 04:00',
        '04:00 - 05:00'
    ];

    // Timetable data structure
    const schedule = {
        Monday: {
            '09:00 - 10:00': { subject: 'Data Structures', type: 'Lecture', room: 'Room 301', color: 'indigo' },
            '11:00 - 12:00': { subject: 'Web Development', type: 'Lab', room: 'Lab 3', color: 'emerald' },
            '02:00 - 03:00': { subject: 'Database Systems', type: 'Lecture', room: 'Room 201', color: 'amber' }
        },
        Tuesday: {
            '08:00 - 09:00': { subject: 'Computer Networks', type: 'Lecture', room: 'Room 405', color: 'rose' },
            '10:00 - 11:00': { subject: 'Operating Systems', type: 'Lab', room: 'Lab 2', color: 'blue' },
            '01:00 - 02:00': { subject: 'Data Structures', type: 'Tutorial', room: 'Room 302', color: 'indigo' }
        },
        Wednesday: {
            '09:00 - 10:00': { subject: 'Web Development', type: 'Lecture', room: 'Room 401', color: 'emerald' },
            '11:00 - 12:00': { subject: 'Database Systems', type: 'Lab', room: 'Lab 1', color: 'amber' },
            '03:00 - 04:00': { subject: 'Operating Systems', type: 'Lecture', room: 'Room 203', color: 'blue' }
        },
        Thursday: {
            '08:00 - 09:00': { subject: 'Computer Networks', type: 'Lab', room: 'Lab 4', color: 'rose' },
            '10:00 - 11:00': { subject: 'Data Structures', type: 'Lecture', room: 'Room 301', color: 'indigo' },
            '02:00 - 03:00': { subject: 'Web Development', type: 'Tutorial', room: 'Room 402', color: 'emerald' }
        },
        Friday: {
            '09:00 - 10:00': { subject: 'Database Systems', type: 'Lecture', room: 'Room 201', color: 'amber' },
            '11:00 - 12:00': { subject: 'Operating Systems', type: 'Tutorial', room: 'Room 204', color: 'blue' },
            '01:00 - 02:00': { subject: 'Computer Networks', type: 'Lecture', room: 'Room 405', color: 'rose' }
        },
        Saturday: {
            '10:00 - 11:00': { subject: 'Extra Class', type: 'Tutorial', room: 'Room 101', color: 'purple' }
        }
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            indigo: 'bg-indigo-100 dark:bg-indigo-900/30 border-l-indigo-600 dark:border-l-indigo-400 text-indigo-900 dark:text-indigo-100',
            emerald: 'bg-emerald-100 dark:bg-emerald-900/30 border-l-emerald-600 dark:border-l-emerald-400 text-emerald-900 dark:text-emerald-100',
            amber: 'bg-amber-100 dark:bg-amber-900/30 border-l-amber-600 dark:border-l-amber-400 text-amber-900 dark:text-amber-100',
            rose: 'bg-rose-100 dark:bg-rose-900/30 border-l-rose-600 dark:border-l-rose-400 text-rose-900 dark:text-rose-100',
            blue: 'bg-blue-100 dark:bg-blue-900/30 border-l-blue-600 dark:border-l-blue-400 text-blue-900 dark:text-blue-100',
            purple: 'bg-purple-100 dark:bg-purple-900/30 border-l-purple-600 dark:border-l-purple-400 text-purple-900 dark:text-purple-100',
        };
        return colors[color] || colors.indigo;
    };

    const getCurrentDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    };

    const currentDay = getCurrentDay();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Weekly Timetable</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your class schedule for the week</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                        <CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{currentDay}</span>
                    </div>
                </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-32">
                                    Time
                                </th>
                                {days.map(day => (
                                    <th
                                        key={day}
                                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${day === currentDay
                                                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                                                : 'text-slate-600 dark:text-slate-400'
                                            }`}
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {timeSlots.map((time, index) => (
                                <tr key={time} className={index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/20'}>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            {time}
                                        </div>
                                    </td>
                                    {days.map(day => {
                                        const daySchedule = schedule[day as keyof typeof schedule];
                                        const classData = daySchedule?.[time as keyof typeof daySchedule];
                                        return (
                                            <td key={`${day}-${time}`} className="px-2 py-2">
                                                {classData ? (
                                                    <div className={`p-3 rounded-lg border-l-4 ${getColorClasses(classData.color)} transition-all duration-200 hover:shadow-md`}>
                                                        <div className="font-semibold text-sm mb-1">{classData.subject}</div>
                                                        <div className="text-xs opacity-80 mb-1">{classData.type}</div>
                                                        <div className="flex items-center gap-1 text-xs opacity-70">
                                                            <MapPin className="w-3 h-3" />
                                                            {classData.room}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-20"></div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Subject Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                        { name: 'Data Structures', color: 'indigo' },
                        { name: 'Web Development', color: 'emerald' },
                        { name: 'Database Systems', color: 'amber' },
                        { name: 'Computer Networks', color: 'rose' },
                        { name: 'Operating Systems', color: 'blue' }
                    ].map(subject => (
                        <div key={subject.name} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-sm border-l-4 ${getColorClasses(subject.color)}`}></div>
                            <span className="text-xs text-slate-600 dark:text-slate-400">{subject.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timetable;
