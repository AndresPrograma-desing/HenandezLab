import { Wallet } from 'lucide-react';

export default function Payroll() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Nómina</h2>
        <p className="text-sm text-slate-500">Pagos y liquidaciones del personal</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <Wallet className="h-8 w-8 text-slate-300" />
        <p className="text-sm text-slate-500">Módulo en construcción</p>
      </div>
    </div>
  );
}
