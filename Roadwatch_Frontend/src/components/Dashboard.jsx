import { AlertTriangle, CheckCircle2, Clock, Map } from 'lucide-react';
import CommunityPoll from './CommunityPoll';

export default function Dashboard() {
  const stats = [
    { label: 'Total Reports', value: '1,248', icon: <Map className="text-brand-500 dark:text-brand-400" />, trend: '+12%' },
    { label: 'Pending Review', value: '42', icon: <Clock className="text-amber-500 dark:text-amber-400" />, trend: '-5%' },
    { label: 'High Priority', value: '18', icon: <AlertTriangle className="text-red-500 dark:text-red-400" />, trend: '+2%' },
    { label: 'Resolved (30d)', value: '384', icon: <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" />, trend: '+24%' },
  ];

  const recentReports = [
    { id: '#RW-892', type: 'Pothole', location: 'Main St & 4th Ave', status: 'Pending', time: '2h ago' },
    { id: '#RW-891', type: 'Traffic Light', location: 'Oak Rd Intersection', status: 'In Progress', time: '5h ago' },
    { id: '#RW-890', type: 'Blocked Drain', location: '72 West Blvd', status: 'Resolved', time: '1d ago' },
    { id: '#RW-889', type: 'Faded Sign', location: 'Lincoln Park', status: 'Pending', time: '1d ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
              {stat.icon}
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Reports</h3>
          <button className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-sm font-medium transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Issue Type</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Reported</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {recentReports.map((report, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{report.id}</td>
                  <td className="p-4 text-slate-900 dark:text-white">{report.type}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{report.location}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                      report.status === 'Resolved' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                      report.status === 'In Progress' ? 'bg-brand-100 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-500/20' :
                      'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">{report.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Community Poll Section */}
      <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CommunityPoll />
      </div>
    </div>
  );
}
