const toneStyles = {
  clinic: 'bg-clinic-50 text-clinic-700',
  health: 'bg-health-50 text-health-600',
  warn: 'bg-warn-50 text-warn-600',
};

export default function StatCard({ label, value, icon: Icon, tone = 'clinic' }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneStyles[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
