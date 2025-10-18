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
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform" onClick={() => onNavigate('home')}>
            VidKing
          </h1>
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <Input
                placeholder="Search movies, TV shows..."
                className="pl-12 pr-12 h-12 bg-zinc-900/90 border-2 border-zinc-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl transition-all hover:border-zinc-600 text-white placeholder:text-zinc-500"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 animate-spin" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('history')}
              className="hover:bg-cyan-500/20 hover:text-cyan-400 transition-all hover:scale-110 rounded-xl h-12 w-12"
            >
              <Clock className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('bookmarks')}
              className="hover:bg-blue-500/20 hover:text-blue-400 transition-all hover:scale-110 rounded-xl h-12 w-12"
            >
              <Bookmark className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
