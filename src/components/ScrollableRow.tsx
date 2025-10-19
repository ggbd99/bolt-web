import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaCard } from './MediaCard';
import { MediaItem, BookmarkItem, WatchHistoryItem } from '../App';

interface ScrollableRowProps {
  title: string;
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;

  isTopTen?: boolean;
  onRemoveItem?: (id: number) => void;
  showRemoveButton?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  bookmarks: BookmarkItem[];
  watchHistory: WatchHistoryItem[];
  toggleBookmark: (media: MediaItem) => void;
  currentSection?: string; // Add this prop
}

export const ScrollableRow: React.FC<ScrollableRowProps> = React.memo(({ 
  title, 
  items, 
  onItemClick, 
  isTopTen = false, 
  onRemoveItem, 
  showRemoveButton = false, 
  showBackButton = false, 
  onBackClick, 
  bookmarks, 
  watchHistory, 
  toggleBookmark,
  currentSection = 'home'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -900 : 900;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-5 py-4">
      {isTopTen ? (
        <div className="px-8 flex items-end gap-6">
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tighter" style={{
            color: 'transparent',
            WebkitTextStroke: '2px #f53232ff',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            TOP 10
          </h2>
          <div className="pb-2">
            <div className="text-sm md:text-xl font-semibold tracking-[10px] text-white uppercase">
              CONTENT
            </div>
            <div className="text-sm md:text-xl font-semibold tracking-[10px] text-white uppercase">
              TODAY
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center px-8 gap-3">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onBackClick} className="hover:bg-cyan-500/20 hover:text-cyan-400 transition-all hover:scale-110 rounded-xl">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          )}
          <h2 className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
      )}
      <div className="relative group/row">
        <div
          ref={scrollContainerRef}
          className={`flex overflow-x-auto overflow-y-hidden scrollbar-hide px-16 pb-4 ${isTopTen ? 'gap-8' : 'gap-5'}`}
          style={{ maxHeight: 'fit-content' }}
        >
          {items.map((item: MediaItem) => (
            <MediaCard 
              key={item.id} 
              media={item} 
              onClick={onItemClick} 
              onRemove={onRemoveItem} 
              showRemove={showRemoveButton} 
              bookmarks={bookmarks} 
              watchHistory={watchHistory} 
              toggleBookmark={toggleBookmark}
              currentSection={currentSection}
            />
          ))}
        </div>
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-16 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 bg-gradient-to-r from-black via-black/80 to-transparent hover:from-black hover:via-black"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-16 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 bg-gradient-to-l from-black via-black/80 to-transparent hover:from-black hover:via-black"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
});