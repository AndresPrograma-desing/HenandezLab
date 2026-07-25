import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/empleados':
        return 'Empleados';
      case '/inventario':
        return 'Inventario';
      case '/vacaciones':
        return 'Vacaciones';
      case '/nomina':
        return 'Nómina';
      default:
        return 'Resumen';
    }
  };

  const title = getTitle();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
