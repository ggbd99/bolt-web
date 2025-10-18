import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, X, Bookmark, BookmarkCheck, Tv, Film, Clock, Calendar } from 'lucide-react';
import { MediaItem, BookmarkItem, WatchHistoryItem } from '../App';
import { formatTVProgress, getProgressPercent } from '../utils/watchHistory';
import { formatRelativeTime } from '../utils/dateUtils';

interface HistoryCardProps {
  historyItem: WatchHistoryItem;
  onClick: (media: MediaItem) => void;
  onPlay: (media: MediaItem) => void;
  onRemove?: (id: number, season?: number, episode?: number) => void;
  showRemove?: boolean;
  bookmarks: BookmarkItem[];
  toggleBookmark: (media: MediaItem) => void;
  episodeName?: string;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  historyItem,
  onClick,
  onPlay,
  onRemove,
  showRemove = false,
  bookmarks,
  toggleBookmark,
  episodeName
}) => {
  const progressPercent = getProgressPercent(historyItem);
  const progressText = formatTVProgress(historyItem);
  const relativeTime = formatRelativeTime(historyItem.timestamp);
  
  const mediaItem: MediaItem = {
    id: historyItem.id,
    title: historyItem.title,
    name: historyItem.title,
    poster_path: historyItem.poster,
    backdrop_path: historyItem.backdrop,
    media_type: historyItem.media_type,
    vote_average: historyItem.vote_average,
    release_date: historyItem.release_date,
    first_air_date: historyItem.release_date,
  };

  const isBookmarked = bookmarks.some(b => b.id === historyItem.id);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      if (historyItem.media_type === 'tv') {
        onRemove(historyItem.id, historyItem.season, historyItem.episode);
      } else {
        onRemove(historyItem.id);
      }
    }
  };

  return (
    <div
      className="cursor-pointer group flex-shrink-0 w-full transition-transform hover:scale-105 snap-start"
      onClick={() => onClick(mediaItem)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 mb-3 shadow-xl group-hover:shadow-2xl group-hover:shadow-cyan-500/40 transition-all duration-300 border border-zinc-800 group-hover:border-cyan-500/50">
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          {showRemove && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/70 hover:bg-red-500/90 backdrop-blur-sm text-white hover:scale-110 transition-all rounded-lg border border-white/20 hover:border-red-400 w-8 h-8"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/70 hover:bg-cyan-500/90 backdrop-blur-sm text-white hover:scale-110 transition-all rounded-lg border border-white/20 hover:border-cyan-400 w-8 h-8"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(mediaItem);
            }}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-white fill-white" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Poster Image */}
        {historyItem.poster ? (
          <>
            <img
              src={`https://image.tmdb.org/t/p/w500${historyItem.poster}`}
              alt={historyItem.title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
            />
            <div 
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              onClick={(e) => { 
                e.stopPropagation(); 
                onPlay(mediaItem); 
              }}
            >
              <div className="transform group-hover:scale-100 transition-transform duration-300">
                <Play className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            {historyItem.media_type === 'tv' ? (
              <Tv className="w-12 h-12 text-zinc-600" />
            ) : (
              <Film className="w-12 h-12 text-zinc-600" />
            )}
          </div>
        )}

        {/* Media Type Badge - Bottom Right */}
        <div className="absolute bottom-2 right-2 z-20">
          <div className={`px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-md flex items-center gap-1 ${
            historyItem.media_type === 'tv' 
              ? 'bg-purple-500/90 text-white' 
              : 'bg-blue-500/90 text-white'
          }`}>
            {historyItem.media_type === 'tv' ? (
              <>
                <Tv className="w-3 h-3" />
                <span>TV Show</span>
              </>
            ) : (
              <>
                <Film className="w-3 h-3" />
                <span>Movie</span>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800 z-30">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Title and Info */}
      <div className="space-y-1.5">
        <h3 className="font-semibold text-white truncate text-sm group-hover:text-cyan-400 transition-colors">
          {historyItem.title}
        </h3>
        
        {/* Progress Information */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{progressText}</span>
          </div>
          
          {/* Episode Name for TV Shows */}
          {historyItem.media_type === 'tv' && episodeName && (
            <div className="text-zinc-500 text-xs truncate">
              {episodeName}
            </div>
          )}
          
          {/* Last Watched Time */}
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{relativeTime}</span>
          </div>
        </div>
        
        {/* Rating and Year */}
        <div className="flex items-center gap-2 text-zinc-500 text-xs">
          <span>⭐ {historyItem.vote_average?.toFixed(1)}</span>
          {historyItem.release_date && (
            <>
              <span>•</span>
              <span>{historyItem.release_date.split('-')[0]}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
