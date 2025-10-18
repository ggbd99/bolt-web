import React from 'react';
import { Clock, Bookmark } from 'lucide-react';
import { MediaItem, WatchHistoryItem, BookmarkItem } from '@/App';
import { ScrollableRow } from '@/components/ScrollableRow';
import { MediaCard } from '@/components/MediaCard';
import { Hero } from '@/components/home/Hero';

interface BrowseViewProps {
  activeTab: string;
  trending: MediaItem[];
  popularMovies: MediaItem[];
  popularTV: MediaItem[];
  watchHistory: WatchHistoryItem[];
  bookmarks: BookmarkItem[];
  searchResults: MediaItem[];
  heroIndex: number;
  heroTransition: boolean;
  heroDetails: MediaItem[];
  onStartWatching: (media: MediaItem) => void;
  onViewDetails: (media: MediaItem) => void;
  toggleBookmark: (media: MediaItem) => void;
  removeFromHistory: (id: number) => void;
  setActiveTab: (tab: string) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  activeTab,
  trending,
  popularMovies,
  popularTV,
  watchHistory,
  bookmarks,
  searchResults,
  heroIndex,
  heroTransition,
  heroDetails,
  onStartWatching,
  onViewDetails,
  toggleBookmark,
  removeFromHistory,
  setActiveTab,
}) => {
  return (
    <>
      {activeTab === 'home' && trending.length > 0 && (
        <Hero
          heroIndex={heroIndex}
          heroTransition={heroTransition}
          trending={trending}
          heroDetails={heroDetails}
          onStartWatching={onStartWatching}
          onViewDetails={onViewDetails}
        />
      )}
      <main className={`relative ${activeTab === 'home' ? 'pt-[100vh]' : 'pt-24'}`}>
        <div className="bg-transparent">
          {searchResults.length > 0 ? (
            <div className="container mx-auto py-6 space-y-4">
              <h2 className="text-2xl font-bold px-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Search Results</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 px-4">
                {searchResults.map((media: MediaItem) => (
                  <MediaCard
                    key={media.id}
                    media={media}
                    onClick={onViewDetails}
                    onPlay={onStartWatching}
                    bookmarks={bookmarks}
                    watchHistory={watchHistory}
                    toggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            </div>
          ) : activeTab === 'home' ? (
            <div className="py-12 space-y-12">
              {trending.length > 0 && (
                <ScrollableRow
                  title="TOP 10 CONTENT TODAY"
                  items={trending.slice(0, 10).map((media: MediaItem, index: number) => ({ ...media, topTenNumber: index + 1 }))}
                  onItemClick={onViewDetails}
                  onPlayClick={onStartWatching}
                  isTopTen={true}
                  bookmarks={bookmarks}
                  watchHistory={watchHistory}
                  toggleBookmark={toggleBookmark}
                />
              )}
              {trending.length > 10 && (
                <ScrollableRow
                  title="Trending Now"
                  items={trending.slice(10, 30)}
                  onItemClick={onViewDetails}
                  onPlayClick={onStartWatching}
                  bookmarks={bookmarks}
                  watchHistory={watchHistory}
                  toggleBookmark={toggleBookmark}
                />
              )}
              {popularMovies.length > 0 && (
                <ScrollableRow
                  title="Popular Movies"
                  items={popularMovies}
                  onItemClick={onViewDetails}
                  onPlayClick={onStartWatching}
                  bookmarks={bookmarks}
                  watchHistory={watchHistory}
                  toggleBookmark={toggleBookmark}
                />
              )}
              {popularTV.length > 0 && (
                <ScrollableRow
                  title="Popular TV Shows"
                  items={popularTV}
                  onItemClick={onViewDetails}
                  onPlayClick={onStartWatching}
                  bookmarks={bookmarks}
                  watchHistory={watchHistory}
                  toggleBookmark={toggleBookmark}
                />
              )}
            </div>
          ) : activeTab === 'history' ? (
            <div className="container mx-auto py-12 space-y-8">
              {watchHistory.length === 0 ? (
                <div className="text-center py-20">
                  <Clock className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400 text-lg">No watch history yet</p>
                </div>
              ) : (
                <ScrollableRow
                  title="Continue Watching"
                  items={watchHistory.map((item: WatchHistoryItem) => ({
                    id: item.id,
                    title: item.title,
                    name: item.title,
                    poster_path: item.poster,
                    media_type: item.media_type,
                    vote_average: item.vote_average,
                    release_date: item.release_date,
                    first_air_date: item.release_date,
                  }))}
                  onItemClick={(media: MediaItem) => {
                    const item = watchHistory.find((h: WatchHistoryItem) => h.id === media.id);
                    if (item) {
                        onViewDetails({
                        ...media,
                        media_type: item.media_type,
                      });
                    }
                  }}
                  onPlayClick={(media: MediaItem) => {
                    const item = watchHistory.find((h: WatchHistoryItem) => h.id === media.id);
                    if (item) {
                        onStartWatching({
                        ...media,
                        media_type: item.media_type,
                      });
                    }
                  }}
                  onRemoveItem={removeFromHistory}
                  showRemoveButton={true}
                  showBackButton={watchHistory.length > 0}
                  onBackClick={() => setActiveTab('home')}
                  bookmarks={bookmarks}
                  watchHistory={watchHistory}
                  toggleBookmark={toggleBookmark}
                />
              )}
            </div>
          ) : activeTab === 'bookmarks' ? (
            <div className="container mx-auto py-12 space-y-8">
              {bookmarks.length === 0 ? (
                <div className="text-center py-20">
                  <Bookmark className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400 text-lg">Your list is empty</p>
                </div>
              ) : (
                <ScrollableRow
                  title="My List"
                  items={bookmarks.map((item: BookmarkItem) => ({
                    id: item.id,
                    title: item.title,
                    name: item.title,
                    poster_path: item.poster,
                    media_type: item.media_type,
                    vote_average: item.vote_average,
                    release_date: item.release_date,
                    first_air_date: item.release_date,
                  }))}
                  onItemClick={(media: MediaItem) => {
                    const item = bookmarks.find((b: BookmarkItem) => b.id === media.id);
                    if (item) {
                        onViewDetails({
                        ...media,
                        media_type: item.media_type,
                      });
                    }
                  }}
                   onPlayClick={(media: MediaItem) => {
                    const item = bookmarks.find((b: BookmarkItem) => b.id === media.id);
                    if (item) {
                        onStartWatching({
                        ...media,
                        media_type: item.media_type,
                      });
                    }
                  }}
                  showBackButton={bookmarks.length > 0}
                  onBackClick={() => setActiveTab('home')}
                  bookmarks={bookmarks}
                  watchHistory={watchHistory}
                  toggleBookmark={toggleBookmark}
                />
              )}
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};
