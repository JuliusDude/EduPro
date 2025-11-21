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
    let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
    let progressBarColor = 'bg-emerald-500';

    if (percentage < 75) {
        statusColor = 'text-rose-600 bg-rose-50 border-rose-100';
        progressBarColor = 'bg-rose-500';
    } else if (percentage < 85) {
        statusColor = 'text-amber-600 bg-amber-50 border-amber-100';
        progressBarColor = 'bg-amber-500';
    }

    // Calculator Logic
    const getStatusMessage = () => {
        if (percentage >= targetPercentage) {
            // Calculate how many classes can be missed
            // (attended) / (total + x) >= target
            // attended >= target * (total + x)
            // attended / target >= total + x
            // (attended / target) - total >= x
            const canMiss = Math.floor((attended / (targetPercentage / 100)) - total);
            return canMiss > 0
                ? `You can miss ${canMiss} next classes`
                : 'On track! Don\'t miss the next class.';
        } else {
            // Calculate how many classes needed to attend
            // (attended + x) / (total + x) >= target
            // attended + x >= target * total + target * x
            // x - target * x >= target * total - attended
            // x (1 - target) >= target * total - attended
            // x >= (target * total - attended) / (1 - target)
            const target = targetPercentage / 100;
            const needed = Math.ceil((target * total - attended) / (1 - target));
            return `Attend next ${needed} classes to reach ${targetPercentage}%`;
        }
    };



    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">{subject}</h3>
                    <p className="text-slate-500 text-sm">{code}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-slate-900">{percentage}%</span>
                <span className="text-slate-500 mb-1 font-medium">/ {targetPercentage}% Target</span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
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
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="text-sm text-slate-600">
                    <span className="font-bold text-slate-900">{attended}</span> / {total} Classes
                </div>
                <button
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    View History
                </button>
            </div>
        </div>
    );
};

export default AttendanceCard;
