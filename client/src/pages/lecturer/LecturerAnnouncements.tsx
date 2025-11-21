import { useState } from 'react';
import { Megaphone, Search, Filter, Calendar, Users, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import AnnouncementModal from '../../components/AnnouncementModal';

const LecturerAnnouncements = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');

    // Mock data for announcements
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Midterm Exam Schedule',
            course: 'CS-301',
            message: 'The midterm exam for Data Structures will be held on June 15th at 10:00 AM in Room 304. Please bring your student ID.',
            date: '2024-05-20',
            priority: 'high',
            recipients: 'All Students'
        },
        {
            id: 2,
            title: 'Assignment 2 Deadline Extended',
            course: 'CS-302',
            message: 'Due to multiple requests, the deadline for Assignment 2 has been extended by 48 hours. The new due date is Friday.',
            date: '2024-05-18',
            priority: 'normal',
            recipients: 'CS-302 Students'
        },
        {
            id: 3,
            title: 'Guest Lecture Next Week',
            course: 'CS-303',
            message: 'We will have a guest lecture from Dr. Alan Smith on Database Optimization next Tuesday. Attendance is mandatory.',
            date: '2024-05-15',
            priority: 'normal',
            recipients: 'CS-303 Students'
        }
    ]);

    const handleCreateAnnouncement = (newAnnouncement: any) => {
        const announcement = {
            id: announcements.length + 1,
            ...newAnnouncement,
            date: new Date().toISOString().split('T')[0],
            recipients: newAnnouncement.course === 'all' ? 'All Students' : `${newAnnouncement.course} Students`
        };
        setAnnouncements([announcement, ...announcements]);
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            setAnnouncements(announcements.filter(a => a.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Announcements</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and send updates to your students</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        <Megaphone className="w-4 h-4" />
                        New Announcement
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all min-w-[200px]"
                    >
                        <option value="all">All Courses</option>
                        <option value="CS-301">CS-301: Data Structures</option>
                        <option value="CS-302">CS-302: Web Development</option>
                        <option value="CS-303">CS-303: Database Systems</option>
                    </select>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                    />
                </div>
            </div>

            {/* Announcements List */}
            <div className="grid gap-4">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${announcement.priority === 'high'
                                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                        }`}>
                                        {announcement.priority === 'high' ? 'High Priority' : 'Normal'}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {announcement.date}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {announcement.recipients}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {announcement.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                    {announcement.message}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(announcement.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSend={handleCreateAnnouncement}
            />
        </div>
    );
};

export default LecturerAnnouncements;
