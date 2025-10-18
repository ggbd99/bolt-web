import { WatchHistoryItem } from '../App';

export const formatWatchTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatTVProgress = (item: WatchHistoryItem): string => {
  const progressPercent = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;
  const timeWatched = formatWatchTime(item.progress);
  
  if (item.media_type === 'tv' && item.season && item.episode) {
    if (progressPercent >= 95) {
      return `S${item.season}:E${item.episode} - Completed`;
    }
    return `S${item.season}:E${item.episode} - ${timeWatched}`;
  }
  
  if (progressPercent >= 95) {
    return 'Completed';
  }
  return timeWatched;
};

export const getProgressPercent = (item: WatchHistoryItem): number => {
  if (!item.duration || item.duration === 0) return 0;
  return Math.min((item.progress / item.duration) * 100, 100);
};

export const shouldShowContinueWatching = (item: WatchHistoryItem): boolean => {
  const progressPercent = getProgressPercent(item);
  return progressPercent > 5 && progressPercent < 95;
};

export const getContinueWatchingItems = (watchHistory: WatchHistoryItem[]): WatchHistoryItem[] => {
  return watchHistory
    .filter(shouldShowContinueWatching)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20);
};

export const findHistoryItem = (
  watchHistory: WatchHistoryItem[],
  mediaId: number,
  mediaType: string,
  season?: number,
  episode?: number
): WatchHistoryItem | undefined => {
  return watchHistory.find(item => {
    if (item.id !== mediaId || item.media_type !== mediaType) return false;
    
    if (mediaType === 'tv' && season && episode) {
      return item.season === season && item.episode === episode;
    }
    
    return true;
  });
};

// Enhanced formatting with episode name support
export const formatTVProgressWithEpisode = (
  item: WatchHistoryItem,
  episodeName?: string
): string => {
  const progressPercent = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;
  const timeWatched = formatWatchTime(item.progress);
  
  if (item.media_type === 'tv' && item.season && item.episode) {
    const episodeInfo = `S${item.season}:E${item.episode}`;
    const status = progressPercent >= 95 ? 'Completed' : timeWatched;
    
    if (episodeName) {
      return `${episodeInfo} - ${episodeName} - ${status}`;
    }
    
    return `${episodeInfo} - ${status}`;
  }
  
  if (progressPercent >= 95) {
    return 'Completed';
  }
  return timeWatched;
};

// Get total watch time across all history
export const getTotalWatchTime = (watchHistory: WatchHistoryItem[]): string => {
  const totalSeconds = watchHistory.reduce((acc, item) => acc + item.progress, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};