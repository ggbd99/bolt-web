import React from 'react';
import { Clock, Bookmark } from 'lucide-react';
import { MediaItem, WatchHistoryItem, BookmarkItem } from '@/App';
import { ScrollableRow } from '@/components/ScrollableRow';
import { MediaCard } from '@/components/MediaCard';
import { ContinueWatchingCard } from '@/components/ContinueWatchingCard';
import { HistoryCard } from '@/components/HistoryCard';

import { Hero } from '@/components/home/Hero';

interface BrowseViewProps {
  activeTab: string;
  trending: MediaItem[];
  popularMovies: MediaItem[];
  popularTV: MediaItem[];
  watchHistory: WatchHistoryItem[];
  bookmarks: BookmarkItem[];

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
  heroIndex,
  heroTransition,
  heroDetails,
  continueWatchingItems,
  onStartWatching,
  onViewDetails,
  toggleBookmark,
  removeFromHistory,

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
          {activeTab === 'home' ? (
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
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
                <>
                  <div className="flex items-center justify-between px-8">
                    <h2 className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      My List
                    </h2>
                    <p className="text-zinc-400 text-sm font-medium">
                      {bookmarks.length} {bookmarks.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                    {bookmarks.map((item: BookmarkItem) => (
                      <MediaCard
                        key={item.id}
                        media={{
                          id: item.id,
                          title: item.title,
                          name: item.title,
                          poster_path: item.poster,
                          media_type: item.media_type,
                          vote_average: item.vote_average,
                          release_date: item.release_date,
                          first_air_date: item.release_date,
                        }}
                        onClick={onViewDetails}
                        bookmarks={bookmarks}
                        watchHistory={watchHistory}
                        toggleBookmark={toggleBookmark}
                        currentSection="bookmarks"
                      />
                    ))}
                  </div>
                </>
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
