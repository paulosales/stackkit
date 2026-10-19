import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let colorClass = 'toast-icon-success';
        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClass = 'toast-icon-error';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClass = 'toast-icon-info';
        }

        return (
          <div key={toast.id} className={`toast toast-${toast.type || 'success'}`}>
            <Icon size={18} className={colorClass} />
            <span>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="btn-icon"
              style={{ width: 20, height: 20, marginLeft: 8 }}
              aria-label="Fechar"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
