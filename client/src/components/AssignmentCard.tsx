import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface AssignmentCardProps {
    title: string;
    subject: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded' | 'overdue';
    description: string;
}

const AssignmentCard = ({ title, subject, dueDate, status, description }: AssignmentCardProps) => {
    const statusConfig = {
        pending: {
            color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50',
            icon: Clock,
            label: 'Pending'
        },
        submitted: {
            color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50',
            icon: CheckCircle2,
            label: 'Submitted'
        },
        graded: {
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50',
            icon: CheckCircle2,
            label: 'Graded'
        },
        overdue: {
            color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50',
            icon: AlertCircle,
            label: 'Overdue'
        }
    };

    const config = statusConfig[status];
    const StatusIcon = config.icon;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${config.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {config.label}
                </span>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {subject}
                </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                {description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{dueDate}</span>
                </div>

                <button className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors shadow-sm hover:shadow">
                    {status === 'pending' || status === 'overdue' ? 'Submit Now' : 'View Submission'}
                </button>
            </div>
        </div>
    );
};

export default AssignmentCard;
