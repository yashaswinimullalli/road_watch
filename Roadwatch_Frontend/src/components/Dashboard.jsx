import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Map, ThumbsUp } from 'lucide-react';

// ── Colour helpers ─────────────────────────────────────────────────────────────
const severityBadge = (severity) => {
  const s = (severity || '').toLowerCase();
  if (s === 'critical' || s === 'high')
    return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20';
  if (s === 'medium' || s === 'moderate')
    return 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
  return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
};

const statusBadge = (status) => {
  switch (status) {
    case 'Resolved':
      return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    case 'In Progress':
      return 'bg-brand-100 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-500/20';
    case 'Under Review':
      return 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20';
    default: // Pending
      return 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
  }
};

const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  try {
    return new Date(dateVal).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return String(dateVal);
  }
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/reports`)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) setReports(result.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading dashboard reports:', err);
        setLoading(false);
      });
  }, []);

  // ── Derived counts ────────────────────────────────────────────────────────
  const totalCount      = reports.length;
  const pendingCount    = reports.filter(r => r.status === 'Pending').length;
  const highPrioCount   = reports.filter(r =>
    ['high', 'critical'].includes((r.severity || '').toLowerCase())
  ).length;
  const resolvedCount   = reports.filter(r => r.status === 'Resolved').length;
  const totalVotes      = reports.reduce((acc, r) => acc + (r.supportCount || 1), 0);

  const stats = [
    { label: 'Total Reports',   value: totalCount,    icon: <Map         className="w-8 h-8 text-brand-500 dark:text-brand-400" />,   color: 'text-brand-600 dark:text-brand-400' },
    { label: 'Pending Review',  value: pendingCount,  icon: <Clock       className="w-8 h-8 text-amber-500 dark:text-amber-400" />,   color: 'text-amber-600 dark:text-amber-400' },
    { label: 'High Priority',   value: highPrioCount, icon: <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />,     color: 'text-red-600 dark:text-red-400' },
    { label: 'Resolved',        value: resolvedCount, icon: <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Community Votes', value: totalVotes,    icon: <ThumbsUp    className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />, color: 'text-indigo-600 dark:text-indigo-400' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Stats Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass-panel p-4 md:p-5 flex flex-col justify-between min-h-[6.5rem] md:min-h-[7.5rem] relative overflow-hidden group"
          >
            {/* faded background icon */}
            <div className="absolute top-0 right-0 p-3 md:p-4 opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
              {stat.icon}
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-tight pr-8">
              {stat.label}
            </span>
            <span className={`text-2xl md:text-3xl font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Recent Reports Table ────────────────────────────────────────────── */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 md:gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              Submitted Road Complaints
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live data from the road damage reports collection
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-full shrink-0">
            <ThumbsUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {totalVotes} Total Community Votes
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-14 text-center text-slate-500 dark:text-slate-400">
            <div className="inline-block w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium">Fetching live road complaints…</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-14 text-center text-slate-500 dark:text-slate-400">
            <ThumbsUp className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-semibold">No reports filed yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Submit road damage reports from the Home screen to view entries here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="w-full text-left border-collapse" style={{ minWidth: '620px' }}>
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Issue Type</th>
                  <th className="px-4 py-3">Authority</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Votes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {reports.map((report, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors text-sm"
                  >
                    {/* Location */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[12rem] truncate whitespace-nowrap" title={report.location}>
                      {report.location || 'Unknown'}
                    </td>

                    {/* Issue Type */}
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {report.issueType}
                    </td>

                    {/* Authority */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[11rem] truncate">
                      {report.authority}
                    </td>

                    {/* Severity badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${severityBadge(report.severity)}`}>
                        {report.severity || 'Unknown'}
                      </span>
                    </td>

                    {/* Support / Vote count */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                        <ThumbsUp className="w-3 h-3" />
                        {report.supportCount} {report.supportCount === 1 ? 'Support' : 'Supports'}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>

                    {/* Submitted date */}
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                      {formatDate(report.submittedDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
