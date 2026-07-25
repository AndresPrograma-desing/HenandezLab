import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, CalendarDays, Wallet, FlaskConical } from 'lucide-react';

const links = [
  { to: '/', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/empleados', label: 'Empleados', icon: Users },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/vacaciones', label: 'Vacaciones', icon: CalendarDays },
  { to: '/nomina', label: 'Nómina', icon: Wallet },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-clinic-600">
          <FlaskConical className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Hernandezlab</p>
          <p className="text-xs text-slate-400">Panel administrativo</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-clinic-50 text-clinic-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
