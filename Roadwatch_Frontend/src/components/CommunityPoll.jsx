import { useState } from 'react';

export default function CommunityPoll() {
  const [voted, setVoted] = useState(false);
  const options = [
    { id: 1, label: 'Massive Pothole on West Main St', votes: 142, color: 'bg-red-500' },
    { id: 2, label: 'Broken Traffic Light at Oak Intersection', votes: 89, color: 'bg-amber-500' },
    { id: 3, label: 'Faded Crosswalk at Lincoln Elementary', votes: 56, color: 'bg-brand-500' },
    { id: 4, label: 'Blocked Storm Drain on 5th Ave', votes: 34, color: 'bg-emerald-500' }
  ];

  // We simulate that the user's report submission bumped the votes up by 1!
  const totalVotes = options.reduce((acc, curr) => acc + curr.votes, 0) + (voted ? 1 : 0);

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Community Priorities Poll</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Vote to escalate ongoing infrastructure issues to city council.</p>
        </div>
        <span className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
          {totalVotes} total votes
        </span>
      </div>

      <div className="space-y-4">
        {options.map((opt) => {
          const currentVotes = opt.votes + (voted && opt.id === 1 ? 1 : 0);
          const percentage = Math.round((currentVotes / totalVotes) * 100);
          
          return (
            <div key={opt.id} className="relative">
              <button 
                onClick={() => setVoted(true)}
                disabled={voted}
                className={`w-full relative z-10 flex justify-between items-center p-4 text-sm font-medium transition-all ${
                  voted && opt.id !== 1 ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'
                } group`}
              >
                <span className="drop-shadow-sm flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${opt.color}`}></span>
                  {opt.label}
                </span>
                
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-600 dark:text-brand-400">
                  {!voted && 'Click to Vote'}
                </span>
                
                {voted && (
                  <span className="font-bold flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-normal">{currentVotes} votes</span>
                    {percentage}%
                  </span>
                )}
              </button>
              
              {/* Progress bar background */}
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                {voted && (
                  <div 
                    className={`h-full opacity-20 dark:opacity-30 ${opt.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {voted && (
        <p className="text-center text-sm text-emerald-600 dark:text-emerald-400 mt-6 font-medium animate-fade-in">
          ✓ Your vote has been recorded and escalated!
        </p>
      )}
    </div>
  );
}
