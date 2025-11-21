import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'indigo' | 'emerald' | 'amber' | 'rose';
}

const StatCard = ({ label, value, icon: Icon, trend, color }: StatCardProps) => {
    const colorStyles = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
        rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                        }`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
            </div>

            <div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
