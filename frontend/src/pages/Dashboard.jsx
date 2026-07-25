import { useEffect, useState } from 'react';
import { Users, PackageX, CalendarDays } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { getDashboardStats } from '../api/dashboardService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setStats({ totalEmployees: 0, criticalItems: 0, onVacation: 0 }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Resumen general</h2>
        <p className="text-sm text-slate-500">Estado actual del laboratorio</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total de empleados"
          value={stats?.totalEmployees ?? '—'}
          icon={Users}
          tone="clinic"
        />
        <StatCard
          label="Insumos críticos"
          value={stats?.criticalItems ?? '—'}
          icon={PackageX}
          tone="warn"
        />
        <StatCard
          label="Vacaciones activas"
          value={stats?.onVacation ?? '—'}
          icon={CalendarDays}
          tone="health"
        />
      </div>
    </div>
  );
}
