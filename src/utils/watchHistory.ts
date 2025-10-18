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
  return progressPercent > 5 && progressPercent < 95; // Show if watched more than 5% but less than 95%
};

export const getContinueWatchingItems = (watchHistory: WatchHistoryItem[]): WatchHistoryItem[] => {
  return watchHistory
    .filter(shouldShowContinueWatching)
    .sort((a, b) => b.timestamp - a.timestamp) // Most recent first
    .slice(0, 20); // Limit to 20 items
};

export const findHistoryItem = (watchHistory: WatchHistoryItem[], mediaId: number, mediaType: string, season?: number, episode?: number): WatchHistoryItem | undefined => {
  return watchHistory.find(item => {
    if (item.id !== mediaId || item.media_type !== mediaType) return false;
    
    if (mediaType === 'tv' && season && episode) {
      return item.season === season && item.episode === episode;
    }
    
    return true;
  });
};