import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface TrailerPlayerProps {
  videoKey: string;
  title: string;
  onClose: () => void;
}

export const TrailerPlayer: React.FC<TrailerPlayerProps> = ({ videoKey, title, onClose }) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[101] p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div 
        className="w-full max-w-6xl mx-auto px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&color=white&playsinline=1`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-white text-lg font-semibold">{title}</p>
          <p className="text-zinc-400 text-sm mt-1">Press ESC or click outside to close</p>
        </div>
      </div>
    </div>
  );
};
