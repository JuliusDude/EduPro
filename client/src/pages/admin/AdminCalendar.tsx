import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, MoreVertical } from 'lucide-react';
import AddEventModal from '../../components/admin/AddEventModal';

const AdminCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Semester Start',
            date: '2024-09-01',
            type: 'academic',
            description: 'Fall Semester 2024 begins'
        },
        {
            id: 2,
            title: 'Mid-Term Exams',
            date: '2024-10-15',
            type: 'exam',
            description: 'Mid-term examinations for all departments'
        },
        {
            id: 3,
            title: 'Faculty Meeting',
            date: '2024-09-10',
            type: 'meeting',
            description: 'Monthly all-hands faculty meeting'
        },
        {
            id: 4,
            title: 'Winter Break',
            date: '2024-12-20',
            type: 'holiday',
            description: 'Winter break starts'
        }
    ]);

    const handleAddEvent = (newEvent: any) => {
        const event = {
            id: events.length + 1,
            ...newEvent
        };
        setEvents([...events, event]);
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Academic Calendar</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage academic schedule and events</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200 dark:shadow-none"
                >
                    <Plus className="w-4 h-4" />
                    Add Event
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {blanks.map((blank) => (
                            <div key={`blank-${blank}`} className="h-24 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-transparent"></div>
                        ))}
                        {days.map((day) => {
                            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayEvents = events.filter(e => e.date === dateStr);

                            return (
                                <div key={day} className="h-24 p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors bg-white dark:bg-slate-900 relative group">
                                    <span className={`text-sm font-medium ${dayEvents.length > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                                        }`}>
                                        {day}
                                    </span>
                                    <div className="mt-1 space-y-1">
                                        {dayEvents.map((event, idx) => (
                                            <div key={idx} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${event.type === 'exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                event.type === 'holiday' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                                    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                                }`}>
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Events List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Upcoming Events</h2>
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg shrink-0 ${event.type === 'exam' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                    event.type === 'holiday' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                        'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                    }`}>
                                    <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{event.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{event.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${event.type === 'exam' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                            event.type === 'holiday' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                                'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                            }`}>
                                            {event.type}
                                        </span>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AddEventModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddEvent}
            />
        </div>
    );
};

export default AdminCalendar;
