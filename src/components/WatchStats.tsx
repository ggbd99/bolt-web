import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Film, Tv, TrendingUp } from 'lucide-react';
import { WatchHistoryItem } from '../App';
import { getTotalWatchTime } from '../utils/watchHistory';

interface WatchStatsProps {
  watchHistory: WatchHistoryItem[];
}

export const WatchStats: React.FC<WatchStatsProps> = ({ watchHistory }) => {
  const totalItems = watchHistory.length;
  const movieCount = watchHistory.filter(item => item.media_type === 'movie').length;
  const tvCount = watchHistory.filter(item => item.media_type === 'tv').length;
  const totalWatchTime = getTotalWatchTime(watchHistory);

  const stats = [
    {
      icon: TrendingUp,
      label: 'Total Items',
      value: totalItems.toString(),
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20'
    },
    {
      icon: Film,
      label: 'Movies',
      value: movieCount.toString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Tv,
      label: 'TV Episodes',
      value: tvCount.toString(),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: Clock,
      label: 'Watch Time',
      value: totalWatchTime,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
