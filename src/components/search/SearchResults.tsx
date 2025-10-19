import React from 'react';
import { MediaItem, BookmarkItem, WatchHistoryItem } from '@/App';
import { MediaCard } from '@/components/MediaCard';

interface SearchResultsProps {
  searchResults: MediaItem[];
  onViewDetails: (media: MediaItem) => void;

  bookmarks: BookmarkItem[];
  watchHistory: WatchHistoryItem[];
  toggleBookmark: (media: MediaItem) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  onViewDetails,
  bookmarks,
  watchHistory,
  toggleBookmark,
}) => {
  return (
    <div className="absolute top-full mt-2 w-full bg-zinc-900 rounded-lg shadow-lg p-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {searchResults.map((media) => (
          <MediaCard
            key={media.id}
            media={media}
            onClick={onViewDetails}
            bookmarks={bookmarks}
            watchHistory={watchHistory}
            toggleBookmark={toggleBookmark}
            currentSection="search"
          />
        ))}
      </div>
    </div>
  );
};