import React from 'react';
import { Search, Clock, Bookmark, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  searchQuery: string;
  isSearching: boolean;
  onSearchChange: (query: string) => void;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  isSearching,
  onSearchChange,
  onNavigate,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/70 to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-indigo-500 cursor-pointer" onClick={() => onNavigate('home')}>
            VidKing
          </h1>
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <Input
                placeholder="Search movies, TV shows..."
                className="pl-10 pr-10 bg-zinc-900/80 border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-md transition-all"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 animate-spin" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('history')}>
              <Clock className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onNavigate('bookmarks')}>
              <Bookmark className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
