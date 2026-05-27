import DashboardComponent from '../components/Dashboard';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">City Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of reported infrastructure issues across the city.</p>
        </div>
      </div>
      
      <DashboardComponent />
    </div>
  );
}
