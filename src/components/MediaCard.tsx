import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Film, X, Bookmark, BookmarkCheck, Tv, Film as MovieIcon } from 'lucide-react';
import { MediaItem, BookmarkItem, WatchHistoryItem } from '../App';

interface MediaCardProps {
  media: MediaItem;
  onClick: (media: MediaItem) => void;
  onPlay: (media: MediaItem) => void;
  onRemove?: (id: number) => void;
  showRemove?: boolean;
  bookmarks: BookmarkItem[];
  watchHistory: WatchHistoryItem[];
  toggleBookmark: (media: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, onClick, onPlay, onRemove, showRemove = false, bookmarks, watchHistory, toggleBookmark }) => {
  const isTopTen = media.topTenNumber !== undefined;
  const historyItem = watchHistory.find((item: WatchHistoryItem) => {
    if (media.media_type === 'tv' || media.first_air_date) {
      return item.id === media.id && item.media_type === 'tv';
    }
    return item.id === media.id && item.media_type === 'movie';
  });

  const hasProgress = historyItem && historyItem.progress && historyItem.duration &&
    (historyItem.progress / historyItem.duration) < 0.95;
  const progressPercent = hasProgress ? (historyItem.progress / historyItem.duration) * 100 : 0;

  if (isTopTen) {
    return (
      <div
        className="cursor-pointer group flex-shrink-0 flex items-end w-[200px] sm:w-[240px] md:w-[280px] transition-transform hover:scale-105 snap-start"
        onClick={() => onClick(media)}
      >
        <div
          className="z-0 text-[180px] sm:text-[220px] md:text-[260px] font-black leading-none select-none -mr-16 sm:-mr-20 md:-mr-24 -translate-x-10"
          style={{
            color: 'transparent',
            WebkitTextStroke: '3px #ef4444',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {media.topTenNumber}
        </div>
        <div className="relative z-10 w-[150px] sm:w-[180px] md:w-[200px] flex-shrink-0">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 shadow-xl group-hover:shadow-2xl group-hover:shadow-cyan-500/40 transition-all duration-300 border border-zinc-800 group-hover:border-cyan-500/50">
            {media.poster_path ? (
              <>
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                  alt={media.title || media.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                     onClick={(e) => { e.stopPropagation(); onPlay(media); }}>
                  <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 z-20 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/60 hover:bg-cyan-500/90 backdrop-blur-sm text-white hover:scale-110 transition-all rounded-lg border border-white/20 hover:border-cyan-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(media);
                    }}
                  >
                    {bookmarks.some((b: BookmarkItem) => b.id === media.id) ? (
                      <BookmarkCheck className="w-5 h-5 text-white fill-white" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <Film className="w-12 h-12 text-zinc-600" />
              </div>
            )}
            {hasProgress && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-30">
                <div
                  className="h-full bg-indigo-600"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer group flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] transition-transform hover:scale-105 snap-start"
      onClick={() => onClick(media)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 mb-2 shadow-xl group-hover:shadow-2xl group-hover:shadow-cyan-500/40 transition-all duration-300 border border-zinc-800 group-hover:border-cyan-500/50">
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          {showRemove && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/60 hover:bg-red-500/90 backdrop-blur-sm text-white hover:scale-110 transition-all rounded-lg border border-white/20 hover:border-red-400"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(media.id);
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/60 hover:bg-cyan-500/90 backdrop-blur-sm text-white hover:scale-110 transition-all rounded-lg border border-white/20 hover:border-cyan-400"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(media);
            }}
          >
            {bookmarks.some((b: BookmarkItem) => b.id === media.id) ? (
              <BookmarkCheck className="w-5 h-5 text-white fill-white" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
        </div>
        {media.poster_path ? (
          <>
            <img
              src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
              alt={media.title || media.name}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                 onClick={(e) => { e.stopPropagation(); onPlay(media); }}>
              <div className="transform group-hover:scale-100 transition-transform duration-300">
                <Play className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <Film className="w-12 h-12 text-zinc-600" />
          </div>
        )}
        {hasProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 h-5 font-semibold border ${
              (media.media_type === 'tv' || media.first_air_date)
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}
          >
            {(media.media_type === 'tv' || media.first_air_date) ? (
              <><Tv className="w-3 h-3 mr-0.5" /> TV</>
            ) : (
              <><MovieIcon className="w-3 h-3 mr-0.5" /> MOVIE</>
            )}
          </Badge>
        </div>
        <h3 className="font-semibold text-white truncate text-sm group-hover:text-cyan-400 transition-colors">
          {media.title || media.name}
        </h3>
        <div className="flex items-center gap-2 text-zinc-500 text-xs">
          <span>{media.vote_average?.toFixed(1)}/10</span>
          {(media.release_date || media.first_air_date) && (
            <span>{(media.release_date || media.first_air_date)?.split('-')[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
};