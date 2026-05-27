import { MapPin, Road, Building2, Wallet, CalendarDays, ShieldAlert, Gauge, Wrench } from 'lucide-react';

const severityColor = (severity) => {
  if (!severity) return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
  const s = severity.toLowerCase();
  if (s === 'high' || s === 'critical') return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
  if (s === 'medium' || s === 'moderate') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
};

const conditionColor = (condition) => {
  if (!condition) return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
  const c = condition.toLowerCase();
  if (c === 'poor' || c === 'bad') return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
  if (c === 'fair' || c === 'average') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
};


const formatDate = (dateStr) => {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export default function RoadReport({ data }) {
  if (!data) return null;


  return (
    <div className="w-full space-y-3 animate-fade-in">

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-500 p-4 text-white shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Road Transparency Report</p>
        <h3 className="text-lg font-bold leading-tight truncate">
          {data.roadName && data.roadName !== 'Unnamed Road' ? data.roadName : data.roadType}
        </h3>
        {data.location && (
          <div className="flex items-start gap-1.5 mt-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/70" />
            <p className="text-xs text-white/80 line-clamp-2 leading-snug">{data.location}</p>
          </div>
        )}
      </div>

      {/* Road Type Badge */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
        <Road className="w-4 h-4 text-brand-500 shrink-0" />
        <span className="text-xs text-slate-500 dark:text-slate-400">Road Type</span>
        <span className="ml-auto text-sm font-semibold text-slate-800 dark:text-white">{data.roadType}</span>
      </div>

      {/* Transparency Data Grid */}
      <div className="grid grid-cols-1 gap-2">

        {/* Contractor */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">Contractor</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{data.contractor}</p>
          </div>
        </div>

        {/* Authority */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">Authority</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{data.authority}</p>
          </div>
        </div>

        {/* Budget Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Allocated</p>
            </div>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{data.budgetAllocated}</p>
          </div>
          <div className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Spent</p>
            </div>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{data.amountSpent}</p>
          </div>
        </div>

        {/* Last Relaying Date */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center shrink-0">
            <CalendarDays className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last Relayed</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">{formatDate(data.lastRelayingDate)}</p>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-700 p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-brand-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">AI Road Analysis</p>
          </div>
          {data.aiConnected && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              🤖 YOLOv8 Live
            </span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Issue Type */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
            <Wrench className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Issue</span>
            <span className="text-xs font-bold text-white">{data.issueType || data.roadDamage || 'N/A'}</span>
          </div>

          {/* Severity */}
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border border-transparent ${severityColor(data.severity)}`}>
            {data.severity || 'N/A'} Severity
          </span>

          {/* Condition */}
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border border-transparent ${conditionColor(data.condition)}`}>
            {data.condition || data.roadDamage || 'N/A'} Condition
          </span>
        </div>

        {/* Confidence + Priority */}
        {(data.confidence != null || data.priorityLevel) && (
          <div className="flex gap-2 flex-wrap pt-1">
            {data.confidence != null && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs text-slate-400">Confidence</span>
                <span className="text-xs font-bold text-indigo-400">
                  {(data.confidence * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {data.priorityLevel && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs text-slate-400">Priority</span>
                <span className={`text-xs font-bold uppercase ${
                  data.priorityLevel === 'critical' ? 'text-red-400' :
                  data.priorityLevel === 'high'     ? 'text-orange-400' :
                  data.priorityLevel === 'moderate' ? 'text-amber-400' :
                                                      'text-emerald-400'
                }`}>{data.priorityLevel}</span>
              </div>
            )}
            {data.priorityScore != null && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-xs text-slate-400">Priority Score</span>
                <span className="text-xs font-bold text-white">{Math.round(data.priorityScore)}/100</span>
              </div>
            )}
          </div>
        )}

        {/* AI Summary */}
        {data.summary && (
          <div className="pt-2 border-t border-slate-700/60">
            <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">AI Summary</p>
            <p className="text-xs text-slate-300 leading-relaxed">{data.summary}</p>
          </div>
        )}
      </div>

    </div>
  );
}
