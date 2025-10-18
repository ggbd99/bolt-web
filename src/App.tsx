import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { BrowseView } from './views/BrowseView';
import { DetailsView } from './views/DetailsView';
import { WatchView } from './views/WatchView';
import { LoadingOverlay } from './components/common/LoadingOverlay';
import { ToastNotification, Toast } from './components/common/ToastNotification';
import { storage } from './utils/storage';
import { getContinueWatchingItems } from './utils/watchHistory';


type Episode = {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string;
};

type Season = {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string;
  air_date: string;
  episodes: Episode[];
};

// Define TypeScript types
export type MediaType = 'movie' | 'tv' | 'person';
export type MediaItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  media_type?: MediaType;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  genres?: Array<{ id: number; name: string }>;
  credits?: { cast: CastMember[] };
  similar?: { results: MediaItem[] };
  images?: { logos?: Array<{ file_path: string }> };
  belongs_to_collection?: { logo_path?: string };
  season_number?: number;
  episode_number?: number;
  still_path?: string;
  topTenNumber?: number;
  seasons?: Season[];
};

type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
};

export type WatchHistoryItem = {
  id: number;
  title: string;
  poster: string;
  backdrop: string;
  media_type: MediaType;
  progress: number;
  duration: number;
  timestamp: number;
  season?: number;
  episode?: number;
  vote_average: number;
  release_date: string;
};

export type BookmarkItem = {
  id: number;
  title: string;
  poster: string;
  media_type: MediaType;
  vote_average: number;
  release_date: string;
};

type PlayerEventData = {
  event: string;
  currentTime?: number;
  duration?: number;
  season?: number;
  episode?: number;
};


const App: React.FC = () => {
  const [view, setView] = useState<'browse' | 'details' | 'watch'>('browse');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTV, setPopularTV] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [lastPlayerState, setLastPlayerState] = useState<PlayerEventData | null>(null);
  const [playerKey, setPlayerKey] = useState<number>(0);
  const [heroIndex, setHeroIndex] = useState<number>(0);
  const [heroDetails, setHeroDetails] = useState<MediaItem[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [heroTransition, setHeroTransition] = useState<boolean>(true);

  const HERO_SLIDE_COUNT = 5;

  const showToast = React.useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  // Enhanced storage management with better error handling
  useEffect(() => {
    // Load watch history from local storage on initial load
    const storedHistory = storage.getItem<WatchHistoryItem[]>('bolt_web_watch_history', []);
    if (storedHistory.length > 0) {
      setWatchHistory(storedHistory);
      console.log('Loaded watch history:', storedHistory.length, 'items');
    }

    // Load bookmarks from local storage on initial load
    const storedBookmarks = storage.getItem<BookmarkItem[]>('bolt_web_bookmarks', []);
    if (storedBookmarks.length > 0) {
      setBookmarks(storedBookmarks);
      console.log('Loaded bookmarks:', storedBookmarks.length, 'items');
    }
  }, []);

  // Save watch history to local storage whenever it changes
  useEffect(() => {
    if (watchHistory.length > 0) {
      const success = storage.setItem('bolt_web_watch_history', watchHistory);
      if (success) {
        console.log('Watch history saved:', watchHistory.length, 'items');
      } else {
        showToast('Failed to save watch history', 'error');
      }
    }
  }, [watchHistory, showToast]);

  // Save bookmarks to local storage whenever they change
  useEffect(() => {
    if (bookmarks.length > 0) {
      const success = storage.setItem('bolt_web_bookmarks', bookmarks);
      if (success) {
        console.log('Bookmarks saved:', bookmarks.length, 'items');
      } else {
        showToast('Failed to save bookmarks', 'error');
      }
    }
  }, [bookmarks, showToast]);

  // Toast notification effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Hero slider effect
  useEffect(() => {
    if (trending.length <= HERO_SLIDE_COUNT) return;
    const interval = setInterval(() => {
      setHeroIndex(prevIndex => prevIndex + 1);
    }, 7000);
    return () => clearInterval(interval);
  }, [trending.length]);

  useEffect(() => {
    if (heroIndex === HERO_SLIDE_COUNT) {
      const timer = setTimeout(() => {
        setHeroTransition(false);
        setHeroIndex(0);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [heroIndex]);

  useEffect(() => {
    if (heroIndex === 0 && !heroTransition) {
      const timer = setTimeout(() => {
        setHeroTransition(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [heroIndex, heroTransition]);

  const loadSeasonEpisodes = React.useCallback(async (tvId: number, seasonNumber: number) => {
    const res = await fetch(`/api/tmdb/tv/${tvId}/season/${seasonNumber}`);
    const data = await res.json();
    setEpisodes(data.episodes || []);
  }, []);

  useEffect(() => {
    const saveToHistory = (eventData: PlayerEventData) => {
      if (!selectedMedia) return;
      
      const historyItem: WatchHistoryItem = {
        id: selectedMedia.id,
        title: selectedMedia.title || selectedMedia.name || '',
        poster: selectedMedia.poster_path || '',
        backdrop: selectedMedia.backdrop_path || '',
        media_type: selectedMedia.media_type || 'movie',
        progress: eventData.currentTime || 0,
        duration: eventData.duration || 0,
        timestamp: Date.now(),
        season: eventData.season || currentSeason,
        episode: eventData.episode || currentEpisode,
        vote_average: selectedMedia.vote_average || 0,
        release_date: selectedMedia.release_date || selectedMedia.first_air_date || ''
      };
      
      setWatchHistory(prev => {
        const filtered = prev.filter((item: WatchHistoryItem) => {
          if (item.media_type === 'tv') {
            return !(item.id === historyItem.id &&
                     item.season === historyItem.season &&
                     item.episode === historyItem.episode);
          }
          return item.id !== historyItem.id;
        });
        return [historyItem, ...filtered].slice(0, 100); // Increased limit to 100
      });
    };

    function handlePlayerMessage(event: MessageEvent) {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'PLAYER_EVENT') {
          const eventData: PlayerEventData = message.data;

          
          if (lastPlayerState && selectedMedia?.media_type === 'tv') {
            const seasonChanged = eventData.season && eventData.season !== lastPlayerState.season;
            const episodeChanged = eventData.episode && eventData.episode !== lastPlayerState.episode;
            if (seasonChanged || episodeChanged) {
              setCurrentSeason(eventData.season!);
              setCurrentEpisode(eventData.episode!);
              if (seasonChanged) {
                loadSeasonEpisodes(selectedMedia.id, eventData.season!);
              }
            }
          }
          setLastPlayerState(eventData);
          
          if (eventData.event === 'timeupdate' && eventData.currentTime! % 30 < 2) {
            saveToHistory(eventData);
          }
          if (eventData.event === 'pause' || eventData.event === 'ended') {
            saveToHistory(eventData);
          }
        }
      } catch {
        // Not a JSON message
      }
    }
    
    window.addEventListener('message', handlePlayerMessage);
    return () => window.removeEventListener('message', handlePlayerMessage);
  }, [selectedMedia, lastPlayerState, watchHistory, currentSeason, currentEpisode, loadSeasonEpisodes]);

  // Data fetching effect
  useEffect(() => {
    if (activeTab === 'home' && trending.length === 0) {
      fetch('/api/tmdb/trending/all/week')
        .then(res => res.json())
        .then(data => {
          const results = data.results || [];
          setTrending(results);
          const heroPromises = results.slice(0, 5).map((item: MediaItem) =>
            fetch(`/api/tmdb/${item.media_type}/${item.id}?append_to_response=images&include_image_language=en,null`)
              .then(res => res.json())
              .catch(err => {
                console.error('Error fetching hero details:', err);
                return item;
              })
          );
          Promise.all(heroPromises).then(detailedItems => {
            setHeroDetails(detailedItems);
          });
        });
      
      fetch('/api/tmdb/movie/popular')
        .then(res => res.json())
        .then(data => setPopularMovies(data.results || []));
      
      fetch('/api/tmdb/tv/popular')
        .then(res => res.json())
        .then(data => setPopularTV(data.results || []));
    } else if (activeTab === 'movies' && popularMovies.length === 0) {
      fetch('/api/tmdb/movie/popular')
        .then(res => res.json())
        .then(data => setPopularMovies(data.results || []));
    } else if (activeTab === 'tv' && popularTV.length === 0) {
      fetch('/api/tmdb/tv/popular')
        .then(res => res.json())
        .then(data => setPopularTV(data.results || []));
    }
  }, [activeTab, trending.length, popularMovies.length, popularTV.length]);



  const handleSearch = React.useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      showToast('Failed to search. Please try again.', 'error');
    } finally {
      setIsSearching(false);
    }
  }, [showToast]);

  const handleViewDetails = React.useCallback(async (media: MediaItem) => {
    setIsLoadingContent(true);
    setLoadingMessage('Loading details...');

    try {
      const type = media.media_type || (media.first_air_date ? 'tv' : 'movie');
      const res = await fetch(`/api/tmdb/${type}/${media.id}?append_to_response=credits,similar,images&include_image_language=en,null`);
      if (!res.ok) throw new Error('Failed to fetch content details');
      const fullDetails: MediaItem = await res.json();
      fullDetails.media_type = type;
      setSelectedMedia(fullDetails);
      setView('details');
    } catch (error) {
      console.error('Error loading details:', error);
      showToast('Failed to load details. Please try again.', 'error');
    } finally {
      setIsLoadingContent(false);
      setLoadingMessage('');
    }
  }, [showToast]);

  const startWatching = React.useCallback(async (media: MediaItem) => {
    setIsLoadingContent(true);
    setLoadingMessage('Loading content...');
    
    try {
      const type = media.media_type || (media.first_air_date ? 'tv' : 'movie');
      const res = await fetch(`/api/tmdb/${type}/${media.id}?append_to_response=credits,similar,images&include_image_language=en,null`);
      if (!res.ok) throw new Error('Failed to fetch content details');
      const fullDetails: MediaItem = await res.json();
      fullDetails.media_type = type;
      setSelectedMedia(fullDetails);
      
      if (type === 'tv') {
        setLoadingMessage('Loading episodes...');
        setSeasons(fullDetails.seasons || []);
        const historyItem = watchHistory.find((h: WatchHistoryItem) => h.id === media.id && h.media_type === 'tv');
        if (historyItem) {
          setCurrentSeason(historyItem.season!);
          setCurrentEpisode(historyItem.episode!);
          await loadSeasonEpisodes(media.id, historyItem.season!);
        } else {
          setCurrentSeason(1);
          setCurrentEpisode(1);
          await loadSeasonEpisodes(media.id, 1);
        }
      }
      
      setLoadingMessage('Starting player...');
      setView('watch');
      setPlayerKey(prev => prev + 1);
      showToast('Content loaded successfully!', 'success');
    } catch (error) {
      console.error('Error loading content:', error);
      showToast('Failed to load content. Please try again.', 'error');
    } finally {
      setIsLoadingContent(false);
      setLoadingMessage('');
    }
  }, [watchHistory, loadSeasonEpisodes, showToast]);

  const changeSeason = async (seasonNumber: number) => {
    if (!selectedMedia) return;
    setCurrentSeason(seasonNumber);
    setCurrentEpisode(1);
    await loadSeasonEpisodes(selectedMedia.id, seasonNumber);
    setPlayerKey(prev => prev + 1);
  };

  const changeEpisode = (episodeNumber: number) => {
    setCurrentEpisode(episodeNumber);
    setPlayerKey(prev => prev + 1);
  };

  const toggleBookmark = (media: MediaItem) => {
    const isBookmarked = bookmarks.some((b: BookmarkItem) => b.id === media.id);
    if (isBookmarked) {
      setBookmarks(bookmarks.filter((b: BookmarkItem) => b.id !== media.id));
      showToast('Removed from your list', 'info');
    } else {
      setBookmarks([{
        id: media.id,
        title: media.title || media.name || '',
        poster: media.poster_path || '',
        media_type: media.media_type || (media.first_air_date ? 'tv' : 'movie'),
        vote_average: media.vote_average || 0,
        release_date: media.release_date || media.first_air_date || ''
      }, ...bookmarks]);
      showToast('Added to your list!', 'success');
    }
  };

  const removeFromHistory = React.useCallback((itemId: number) => {
    setWatchHistory(prev => prev.filter(item => item.id !== itemId));
    showToast('Removed from watch history', 'info');
  }, [showToast]);

  const getPlayerUrl = () => {
    if (!selectedMedia) return '';
    
    const type = selectedMedia.media_type;
    const id = selectedMedia.id;
    
    if (type === 'tv') {
      const baseUrl = `https://www.vidking.net/embed/tv/${id}/${currentSeason}/${currentEpisode}`;
      const params = new URLSearchParams({
        episodeSelector: 'true',
        nextEpisode: 'true',
        color: '6366f1'
      });
      
      const historyItem = watchHistory.find((item: WatchHistoryItem) =>
        item.id === id && item.media_type === 'tv' &&
        item.season === currentSeason && item.episode === currentEpisode
      );
      
      if (historyItem && historyItem.progress) {
        params.append('progress', Math.floor(historyItem.progress).toString());
      }
      
      return `${baseUrl}?${params.toString()}`;
    }
    
    const baseUrl = `https://www.vidking.net/embed/movie/${id}`;
    const params = new URLSearchParams({
      color: '6366f1'
    });
    
    const historyItem = watchHistory.find((item: WatchHistoryItem) =>
      item.id === id && item.media_type === 'movie'
    );
    
    if (historyItem && historyItem.progress) {
      params.append('progress', Math.floor(historyItem.progress).toString());
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  // Get continue watching items for display
  const continueWatchingItems = getContinueWatchingItems(watchHistory);

  if (view === 'details' && selectedMedia) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        {isLoadingContent && <LoadingOverlay loadingMessage={loadingMessage} />}
        <ToastNotification toast={toast} />
        <DetailsView
          selectedMedia={selectedMedia}
          bookmarks={bookmarks}
          onBack={() => setView('browse')}
          onPlay={startWatching}
          onViewDetails={handleViewDetails}
          toggleBookmark={toggleBookmark}
        />
      </div>
    );
  }

  if (view === 'watch' && selectedMedia) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AdBlockDetector />
        {isLoadingContent && <LoadingOverlay loadingMessage={loadingMessage} />}
        <ToastNotification toast={toast} />
        <WatchView
          selectedMedia={selectedMedia}
          bookmarks={bookmarks}
          currentSeason={currentSeason}
          currentEpisode={currentEpisode}
          seasons={seasons}
          episodes={episodes}
          playerKey={playerKey}
          getPlayerUrl={getPlayerUrl}
          onBack={() => setView('browse')}
          toggleBookmark={toggleBookmark}
          changeSeason={changeSeason}
          changeEpisode={changeEpisode}
          onViewDetails={handleViewDetails}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 text-white">
      {isLoadingContent && <LoadingOverlay loadingMessage={loadingMessage} />}
      <ToastNotification toast={toast} />
      <Header
        searchQuery={searchQuery}
        isSearching={isSearching}
        onSearchChange={handleSearch}
        onNavigate={setActiveTab}
      />
      <BrowseView
        activeTab={activeTab}
        trending={trending}
        popularMovies={popularMovies}
        popularTV={popularTV}
        watchHistory={watchHistory}
        bookmarks={bookmarks}
        searchResults={searchResults}
        heroIndex={heroIndex}
        heroTransition={heroTransition}
        heroDetails={heroDetails}
        continueWatchingItems={continueWatchingItems}
        onStartWatching={startWatching}
        onViewDetails={handleViewDetails}
        toggleBookmark={toggleBookmark}
        removeFromHistory={removeFromHistory}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default App;