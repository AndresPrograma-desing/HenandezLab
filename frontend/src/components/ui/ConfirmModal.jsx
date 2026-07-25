import { AlertTriangle, Loader2 } from 'lucide-react';

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  loading = false,
  variant = 'danger', // 'danger' | 'warning' | 'info'
}) {
  if (!open) return null;

  const iconColors = {
    danger: 'bg-red-50 text-red-600 border-red-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-100 active:scale-[0.98]',
    warning: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-100 active:scale-[0.98]',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-100 active:scale-[0.98]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with slight blur */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={loading ? undefined : onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          {/* Icon wrapper */}
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${iconColors[variant]}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 leading-6">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        
        {/* Actions footer */}
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-4 disabled:opacity-70 disabled:pointer-events-none ${buttonColors[variant]}`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
