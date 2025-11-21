import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AssignmentCardProps {
    title: string;
    subject: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded' | 'overdue';
    description: string;
}

const AssignmentCard = ({ title, subject, dueDate, status, description }: AssignmentCardProps) => {
    const statusConfig = {
        pending: { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock, label: 'Pending' },
        submitted: { color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: CheckCircle2, label: 'Submitted' },
        graded: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2, label: 'Graded' },
        overdue: { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: AlertCircle, label: 'Overdue' },
    };

    const config = statusConfig[status];
    const StatusIcon = config.icon;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                    {subject}
                </span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {config.label}
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {title}
            </h3>

            <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                {description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Due {dueDate}</span>
                </div>

                {status === 'pending' && (
                    <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                        Submit
                    </button>
                )}
                {status === 'submitted' && (
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                        View Submission
                    </button>
                )}
            </div>
        </div>
    );
};

export default AssignmentCard;
