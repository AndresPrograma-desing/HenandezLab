import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, FlaskConical, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-900 bg-[url('/lab_background.png')] bg-cover bg-center px-4 py-12">
      {/* Premium dark overlay to enhance card readability */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[3px]" />

      <div className="relative z-10 w-full max-w-[420px] transform transition-all">
        {/* Glassmorphic Card */}
        <div className="rounded-3xl border border-white/20 bg-white/75 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl">
          {/* Logo and Header inside the card for integration */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-clinic-600 to-clinic-500 shadow-lg shadow-clinic-500/25">
              <FlaskConical className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">HernandezLab</h1>
            <p className="mt-1.5 text-center text-sm font-medium text-slate-500">
              Ingresa a tu panel administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nombre@hernandezlab.com"
                  className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-clinic-500 focus:bg-white focus:ring-4 focus:ring-clinic-100/50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-3 pl-11 pr-11 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-clinic-500 focus:bg-white focus:ring-4 focus:ring-clinic-100/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((show) => !show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/80 p-3 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-clinic-600 to-clinic-500 py-3 text-sm font-semibold text-white shadow-md shadow-clinic-500/20 transition-all hover:from-clinic-700 hover:to-clinic-600 hover:shadow-lg hover:shadow-clinic-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
