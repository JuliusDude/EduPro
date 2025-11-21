import { useState } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import { Search } from 'lucide-react';

const Assignments = () => {
  const [filter, setFilter] = useState('all');

  const assignments = [
    {
      id: 1,
      title: 'Algorithm Analysis Report',
      subject: 'Data Structures',
      dueDate: 'Oct 24, 2025',
      status: 'pending' as const,
      description: 'Analyze the time complexity of the provided sorting algorithms and write a detailed report comparing their performance on different datasets.'
    },
    {
      id: 2,
      title: 'Portfolio Website',
      subject: 'Web Development',
      dueDate: 'Oct 20, 2025',
      status: 'submitted' as const,
      description: 'Design and implement a personal portfolio website using React and Tailwind CSS. Ensure it is fully responsive.'
    },
    {
      id: 3,
      title: 'Database Schema Design',
      subject: 'Database Systems',
      dueDate: 'Oct 15, 2025',
      status: 'graded' as const,
      description: 'Create an ER diagram and normalized database schema for a library management system.'
    },
    {
      id: 4,
      title: 'Network Topology Lab',
      subject: 'Computer Networks',
      dueDate: 'Oct 22, 2025',
      status: 'overdue' as const,
      description: 'Configure a network topology using Cisco Packet Tracer and document the routing protocols used.'
    }
  ];

  const filteredAssignments = filter === 'all'
    ? assignments
    : assignments.filter(a => a.status === filter);

  const tabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'graded', label: 'Graded' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Assignments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your academic tasks</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-center w-full lg:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 dark:text-slate-200 transition-all"
            />
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1 md:flex-none ${filter === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map(assignment => (
          <AssignmentCard key={assignment.id} {...assignment} />
        ))}
      </div>
    </div >
  );
};

export default Assignments;
