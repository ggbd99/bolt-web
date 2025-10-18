import React from 'react';
import { Clock, Bookmark, Calendar, Tv, Film, Play } from 'lucide-react';
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
                <div className="space-y-8">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Continue Watching</h2>
                  </div>
                  <div className="px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {watchHistory.map((item: WatchHistoryItem) => {
                        const progressPercent = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;
                        const timeRemaining = item.duration > 0 ? Math.max(0, item.duration - item.progress) : 0;
                        const hours = Math.floor(timeRemaining / 3600);
                        const minutes = Math.floor((timeRemaining % 3600) / 60);

                        return (
                          <div
                            key={`${item.id}-${item.season || 0}-${item.episode || 0}`}
                            className="group cursor-pointer rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20"
                            onClick={() => {
                              onStartWatching({
                                id: item.id,
                                title: item.title,
                                name: item.title,
                                poster_path: item.poster,
                                media_type: item.media_type,
                                vote_average: item.vote_average,
                                release_date: item.release_date,
                                first_air_date: item.release_date,
                              });
                            }}
                          >
                            <div className="relative aspect-video">
                              <img
                                src={`https://image.tmdb.org/t/p/w500${item.backdrop}`}
                                alt={item.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="transform group-hover:scale-100 transition-transform duration-300">
                                  <Play className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" />
                                </div>
                              </div>
                              <div className="absolute top-3 left-3">
                                {item.media_type === 'tv' ? (
                                  <div className="flex items-center gap-1.5 bg-blue-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-400/30 shadow-lg">
                                    <Tv className="w-3.5 h-3.5" />
                                    TV SHOW
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-red-400/30 shadow-lg">
                                    <Film className="w-3.5 h-3.5" />
                                    MOVIE
                                  </div>
                                )}
                              </div>
                              {progressPercent > 0 && progressPercent < 95 && (
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
                                  <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="p-4 space-y-2">
                              <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-cyan-400 transition-colors">
                                {item.title}
                              </h3>
                              {item.media_type === 'tv' && item.season && item.episode ? (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-cyan-400 font-semibold">
                                    S{item.season} E{item.episode}
                                  </span>
                                  {timeRemaining > 0 && (
                                    <>
                                      <span className="text-zinc-600">•</span>
                                      <span className="text-zinc-400">
                                        {minutes}m left
                                      </span>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-sm">
                                  {timeRemaining > 0 ? (
                                    <span className="text-zinc-400">
                                      {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`} left
                                    </span>
                                  ) : (
                                    <span className="text-green-400 font-semibold">Completed</span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
