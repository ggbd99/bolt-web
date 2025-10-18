import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  loadingMessage: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loadingMessage }) => (
  <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center">
    <div className="bg-zinc-900/80 rounded-2xl p-8 shadow-2xl border-2 border-zinc-700/50 max-w-md w-full mx-4 backdrop-blur-lg">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
          <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white">Please Wait</h3>
          <p className="text-zinc-300 font-medium">{loadingMessage || 'Loading...'}</p>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse shadow-lg shadow-cyan-500/50" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  </div>
);
