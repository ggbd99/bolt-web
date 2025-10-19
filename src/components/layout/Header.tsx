import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, Bookmark, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MediaItem, BookmarkItem, WatchHistoryItem } from '@/App';
import { SearchResults } from '@/components/search/SearchResults';

interface HeaderProps {
  searchQuery: string;
  isSearching: boolean;
  onSearchChange: (query: string) => void;
  onNavigate: (tab: string) => void;
  searchResults: MediaItem[];
  onViewDetails: (media: MediaItem) => void;
  onStartWatching: (media: MediaItem) => void;
  bookmarks: BookmarkItem[];
  watchHistory: WatchHistoryItem[];
  toggleBookmark: (media: MediaItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  isSearching,
  onSearchChange,
  onNavigate,
  searchResults,
  onViewDetails,
  onStartWatching,
  bookmarks,
  watchHistory,
  toggleBookmark,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null); // Ref for the search area

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(true);
  };

  // Effect to handle clicks outside the search area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          onSearchChange(''); // Clear search query when closing
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, onSearchChange]); // Re-run effect if isSearchOpen or onSearchChange changes

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onNavigate('home')}
          >
            VidKing
          </h1>
          
          <div className="flex-1 max-w-2xl relative" ref={searchRef}> {/* Attach ref here */}
            {isSearchOpen ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <Input
                  placeholder="Search movies, TV shows..."
                  className="pl-10 pr-10 h-11 bg-zinc-900/90 border-2 border-zinc-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-lg transition-all hover:border-zinc-600 text-white placeholder:text-zinc-500 font-medium"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  // Removed onBlur as it conflicts with click outside logic
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {isSearching && !searchQuery && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 animate-spin" />
                )}
                {searchQuery && searchResults.length > 0 && (
                  <SearchResults
                    searchResults={searchResults}
                    onViewDetails={onViewDetails}
                    onStartWatching={onStartWatching}
                    bookmarks={bookmarks}
                    watchHistory={watchHistory}
                    toggleBookmark={toggleBookmark}
                  />
                )}
              </div>
            ) : (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSearchIconClick}
                  className="hover:bg-cyan-500/20 hover:text-cyan-400 transition-all hover:scale-110 rounded-lg h-11 w-11"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('history')}
              className="hover:bg-cyan-500/20 hover:text-cyan-400 transition-all hover:scale-110 rounded-lg h-11 w-11"
            >
              <Clock className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('bookmarks')}
              className="hover:bg-blue-500/20 hover:text-blue-400 transition-all hover:scale-110 rounded-lg h-11 w-11"
            >
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
