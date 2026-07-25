import { useState } from 'react';
import { LogOut, ChevronDown, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clinic-50 text-clinic-700">
            <UserRound className="h-4 w-4" />
          </span>
          <span className="font-medium text-slate-700">{user?.name || 'Usuario'}</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
