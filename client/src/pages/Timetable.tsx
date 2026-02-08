import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import studentApi from '../services/studentApi';

interface TimetableSlot {
    id: string;
    startTime: string;
    endTime: string;
    subject: {
        id: string;
        name: string;
        code: string;
    };
    lecturer: {
        name: string;
    };
    roomNumber: string | null;
    slotType: string;
}

interface DaySchedule {
    day: string;
    slots: TimetableSlot[];
}

const Timetable = () => {
    const [timetable, setTimetable] = useState<DaySchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const displayDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
    ];

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await studentApi.getTimetable();
                setTimetable(response.data.timetable);
            } catch (err: any) {
                console.error('Failed to fetch timetable:', err);
                setError(err.response?.data?.message || 'Failed to load timetable');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTimetable();
    }, []);

    const getColorClasses = (index: number) => {
        const colors = [
            'bg-indigo-100 dark:bg-indigo-900/30 border-l-indigo-600 dark:border-l-indigo-400 text-indigo-900 dark:text-indigo-100',
            'bg-emerald-100 dark:bg-emerald-900/30 border-l-emerald-600 dark:border-l-emerald-400 text-emerald-900 dark:text-emerald-100',
            'bg-amber-100 dark:bg-amber-900/30 border-l-amber-600 dark:border-l-amber-400 text-amber-900 dark:text-amber-100',
            'bg-rose-100 dark:bg-rose-900/30 border-l-rose-600 dark:border-l-rose-400 text-rose-900 dark:text-rose-100',
            'bg-blue-100 dark:bg-blue-900/30 border-l-blue-600 dark:border-l-blue-400 text-blue-900 dark:text-blue-100',
            'bg-purple-100 dark:bg-purple-900/30 border-l-purple-600 dark:border-l-purple-400 text-purple-900 dark:text-purple-100',
        ];
        return colors[index % colors.length];
    };

    const getCurrentDay = () => {
        const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return dayNames[new Date().getDay()];
    };

    const currentDay = getCurrentDay();

    const getSlotForTimeAndDay = (day: string, time: string) => {
        const daySchedule = timetable.find(d => d.day === day);
        if (!daySchedule) return null;

        return daySchedule.slots.find(slot => {
            const slotHour = slot.startTime.split(':')[0];
            const timeHour = time.split(':')[0];
            return slotHour === timeHour;
        });
    };

    // Build subject color map
    const subjectColorMap = new Map<string, number>();
    let colorIndex = 0;
    timetable.forEach(day => {
        day.slots.forEach(slot => {
            if (!subjectColorMap.has(slot.subject.id)) {
                subjectColorMap.set(slot.subject.id, colorIndex++);
            }
        });
    });

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

    // Get unique subjects for legend
    const uniqueSubjects = Array.from(subjectColorMap.entries()).map(([id, idx]) => {
        const slot = timetable.flatMap(d => d.slots).find(s => s.subject.id === id);
        return { id, name: slot?.subject.name || '', colorIndex: idx };
    });

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
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {displayDays[days.indexOf(currentDay)] || currentDay}
                        </span>
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
                                {displayDays.map((day, idx) => (
                                    <th
                                        key={day}
                                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${days[idx] === currentDay
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
                                            {time} - {String(parseInt(time) + 1).padStart(2, '0')}:00
                                        </div>
                                    </td>
                                    {days.map(day => {
                                        const slot = getSlotForTimeAndDay(day, time);
                                        return (
                                            <td key={`${day}-${time}`} className="px-2 py-2">
                                                {slot ? (
                                                    <div className={`p-3 rounded-lg border-l-4 ${getColorClasses(subjectColorMap.get(slot.subject.id) || 0)} transition-all duration-200 hover:shadow-md`}>
                                                        <div className="font-semibold text-sm mb-1">{slot.subject.name}</div>
                                                        <div className="text-xs opacity-80 mb-1">{slot.slotType}</div>
                                                        {slot.roomNumber && (
                                                            <div className="flex items-center gap-1 text-xs opacity-70">
                                                                <MapPin className="w-3 h-3" />
                                                                {slot.roomNumber}
                                                            </div>
                                                        )}
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
            {uniqueSubjects.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Subject Legend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {uniqueSubjects.map(subject => (
                            <div key={subject.id} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-sm border-l-4 ${getColorClasses(subject.colorIndex)}`}></div>
                                <span className="text-xs text-slate-600 dark:text-slate-400">{subject.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timetable;
