import { MoreVertical } from 'lucide-react';

interface AttendanceCardProps {
    subject: string;
    code: string;
    attended: number;
    total: number;
    targetPercentage?: number;
}

const AttendanceCard = ({ subject, code, attended, total, targetPercentage = 75 }: AttendanceCardProps) => {

    const percentage = Math.round((attended / total) * 100) || 0;

    // Color logic
    let statusColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50';
    let progressBarColor = 'bg-emerald-500 dark:bg-emerald-400';

    if (percentage < 75) {
        statusColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50';
        progressBarColor = 'bg-rose-500 dark:bg-rose-400';
    } else if (percentage < 85) {
        statusColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50';
        progressBarColor = 'bg-amber-500 dark:bg-amber-400';
    }

    // Calculator Logic
    const getStatusMessage = () => {
        if (percentage >= targetPercentage) {
            const canMiss = Math.floor((attended / (targetPercentage / 100)) - total);
            return canMiss > 0
                ? `You can miss ${canMiss} next classes`
                : 'On track! Don\'t miss the next class.';
        } else {
            const target = targetPercentage / 100;
            const needed = Math.ceil((target * total - attended) / (1 - target));
            return `Attend next ${needed} classes to reach ${targetPercentage}%`;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{subject}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{code}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{percentage}%</span>
                <span className="text-slate-500 dark:text-slate-400 mb-1 font-medium">/ {targetPercentage}% Target</span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            {/* Status Message */}
            <div className={`py-2 px-3 rounded-lg text-sm font-medium mb-6 ${statusColor} border`}>
                {getStatusMessage()}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white">{attended}</span> / {total} Classes
                </div>
                <button
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    View History
                </button>
            </div>
        </div>
    );
};

export default AttendanceCard;
