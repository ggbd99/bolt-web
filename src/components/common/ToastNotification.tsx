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
    success: <Check className="w-5 h-5 text-green-500" />,
    error: <X className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-500/10 border-green-500/50',
    error: 'bg-red-500/10 border-red-500/50',
    info: 'bg-blue-500/10 border-blue-500/50'
  };

  return (
    <div className="fixed top-20 right-4 z-[101] animate-in slide-in-from-top duration-300">
      <div className={`${bgColors[toast.type]} border rounded-lg p-4 shadow-2xl backdrop-blur-sm min-w-[300px] flex items-center gap-3`}>
        {icons[toast.type]}
        <p className="text-white font-medium flex-1">{toast.message}</p>
      </div>
    </div>
  );
};
