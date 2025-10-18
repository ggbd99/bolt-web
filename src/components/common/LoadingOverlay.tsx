import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  loadingMessage: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loadingMessage }) => (
  <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-zinc-900 rounded-lg p-8 shadow-2xl border border-zinc-800 max-w-md w-full mx-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white">Please Wait</h3>
          <p className="text-zinc-400">{loadingMessage || 'Loading...'}</p>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  </div>
);
