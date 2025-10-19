import React from 'react';
import { Clock, Bookmark } from 'lucide-react';
import { MediaItem, WatchHistoryItem, BookmarkItem } from '@/App';
import { ScrollableRow } from '@/components/ScrollableRow';
import { MediaCard } from '@/components/MediaCard';
import { ContinueWatchingCard } from '@/components/ContinueWatchingCard';
import { HistoryCard } from '@/components/HistoryCard';
import { WatchStats } from '@/components/WatchStats';
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
  continueWatchingItems: WatchHistoryItem[];
  onStartWatching: (media: MediaItem) => void;
  onViewDetails: (media: MediaItem) => void;
  toggleBookmark: (media: MediaItem) => void;
  removeFromHistory: (id: number, season?: number, episode?: number) => void;
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
  continueWatchingItems,
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
                    currentSection="search"
                  />
                ))}
              </div>
            </div>
          ) : activeTab === 'home' ? (
            <div className="py-12 space-y-12">
              {/* Continue Watching Section */}
              {continueWatchingItems.length > 0 && (
                <div className="space-y-5 py-4">
                  <div className="flex items-center px-8 gap-3">
                    <h2 className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Continue Watching
                    </h2>
                  </div>
                  <div className="relative group/row">
                    <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide px-16 pb-4 gap-5">
                      {continueWatchingItems.map((item: WatchHistoryItem) => (
                        <ContinueWatchingCard
                          key={`${item.id}-${item.season || 0}-${item.episode || 0}`}
                          historyItem={item}
                          onClick={onViewDetails}
                          onPlay={onStartWatching}
                          bookmarks={bookmarks}
                          toggleBookmark={toggleBookmark}
                          showContinueTag={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                  currentSection="home"
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
                  currentSection="home"
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
                  currentSection="home"
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
                  currentSection="home"
                />
              )}
            </div>
          ) : activeTab === 'history' ? (
            <div className="container mx-auto py-12 space-y-8">
              {watchHistory.length === 0 ? (
                <div className="text-center py-20">
                  <Clock className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400 text-base font-medium">No watch history yet</p>
                  <p className="text-zinc-500 text-sm mt-2">Start watching something to see your history here</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Watch Statistics */}
                  <WatchStats watchHistory={watchHistory} />

                  {/* Continue Watching Items */}
                  {continueWatchingItems.length > 0 && (
                    <div className="space-y-5 py-4">
                      <div className="flex items-center px-8 gap-3">
                        <h2 className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                          Continue Watching
                        </h2>
                        <span className="text-zinc-400 text-sm font-medium">({continueWatchingItems.length})</span>
                      </div>
                      <div className="relative group/row">
                        <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide px-16 pb-4 gap-5">
                          {continueWatchingItems.map((item: WatchHistoryItem) => (
                            <ContinueWatchingCard
                              key={`${item.id}-${item.season || 0}-${item.episode || 0}-${item.timestamp}`}
                              historyItem={item}
                              onClick={onViewDetails}
                              onPlay={onStartWatching}
                              onRemove={removeFromHistory}
                              showRemove={true}
                              bookmarks={bookmarks}
                              toggleBookmark={toggleBookmark}
                              showContinueTag={false}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* All Watch History */}
                  <div className="space-y-5 py-4">
                    <div className="flex items-center justify-between px-8">
                      <h2 className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        All Watch History
                      </h2>
                      <p className="text-zinc-400 text-sm font-medium">
                        {watchHistory.length} {watchHistory.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="px-8">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 max-h-[800px] overflow-y-auto pr-4 pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                        {watchHistory.map((item: WatchHistoryItem) => (
                          <HistoryCard
                            key={`${item.id}-${item.season || 0}-${item.episode || 0}-${item.timestamp}`}
                            historyItem={item}
                            onClick={onViewDetails}
                            onPlay={onStartWatching}
                            onRemove={removeFromHistory}
                            showRemove={true}
                            bookmarks={bookmarks}
                            toggleBookmark={toggleBookmark}
                            episodeName={item.episodeName}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'bookmarks' ? (
            <div className="container mx-auto py-12 space-y-8">
              {bookmarks.length === 0 ? (
                <div className="text-center py-20">
                  <Bookmark className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400 text-base font-medium">Your list is empty</p>
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
                  currentSection="bookmarks"
                />
              )}
            </div>
          ) : activeTab === 'movies' ? (
            <div className="py-12 space-y-12">
              {/* Continue Watching Movies */}
              {continueWatchingItems.filter(item => item.media_type === 'movie').length > 0 && (
                <div className="space-y-5 py-4">
                  <div className="flex items-center px-8 gap-3">
                    <h2 className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Continue Watching Movies
                    </h2>
                  </div>
                  <div className="relative group/row">
                    <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide px-16 pb-4 gap-5">
                      {continueWatchingItems
                        .filter(item => item.media_type === 'movie')
                        .map((item: WatchHistoryItem) => (
                        <ContinueWatchingCard
                          key={item.id}
                          historyItem={item}
                          onClick={onViewDetails}
                          onPlay={onStartWatching}
                          bookmarks={bookmarks}
                          toggleBookmark={toggleBookmark}
                          showContinueTag={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
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
                  currentSection="movies"
                />
              )}
            </div>
          ) : activeTab === 'tv' ? (
            <div className="py-12 space-y-12">
              {/* Continue Watching TV Shows */}
              {continueWatchingItems.filter(item => item.media_type === 'tv').length > 0 && (
                <div className="space-y-5 py-4">
                  <div className="flex items-center px-8 gap-3">
                    <h2 className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Continue Watching TV Shows
                    </h2>
                  </div>
                  <div className="relative group/row">
                    <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide px-16 pb-4 gap-5">
                      {continueWatchingItems
                        .filter(item => item.media_type === 'tv')
                        .map((item: WatchHistoryItem) => (
                        <ContinueWatchingCard
                          key={`${item.id}-${item.season}-${item.episode}`}
                          historyItem={item}
                          onClick={onViewDetails}
                          onPlay={onStartWatching}
                          bookmarks={bookmarks}
                          toggleBookmark={toggleBookmark}
                          showContinueTag={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
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
                  currentSection="tv"
                />
              )}
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};
