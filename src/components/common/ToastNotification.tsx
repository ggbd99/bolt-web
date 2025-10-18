import React from 'react';
import { Check, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  message: string;
  type: ToastType;
}

interface ToastNotificationProps {
  toast: Toast | null;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast }) => {
  if (!toast) return null;

  const icons = {
    success: <Check className="w-5 h-5 text-white" />,
    error: <X className="w-5 h-5 text-white" />,
    info: <Info className="w-5 h-5 text-white" />
  };

  const bgColors = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400/30 shadow-green-500/50',
    error: 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400/30 shadow-red-500/50',
    info: 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400/30 shadow-cyan-500/50'
  };

  return (
    <div className="fixed top-20 right-4 z-[101] animate-in slide-in-from-top duration-300">
      <div className={`${bgColors[toast.type]} border-2 rounded-xl px-6 py-4 shadow-2xl backdrop-blur-md min-w-[300px] flex items-center gap-3`}>
        {icons[toast.type]}
        <p className="text-white font-semibold flex-1">{toast.message}</p>
      </div>
    </div>
  );
};
