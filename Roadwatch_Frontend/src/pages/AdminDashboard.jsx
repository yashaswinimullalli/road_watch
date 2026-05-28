import DashboardComponent from '../components/Dashboard';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 md:mb-8 gap-2 md:gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">City Dashboard</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of reported infrastructure issues across the city.</p>
        </div>
      </div>
      
      <DashboardComponent />
    </div>
  );
}
