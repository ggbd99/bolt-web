import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Play, Star, Clock, Bookmark, BookmarkCheck, Film, Tv, Info } from 'lucide-react';
import { MediaItem, BookmarkItem } from '@/App'; // Assuming types are exported from App

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

  type CastMember = {
    id: number;
    name: string;
    character: string;
    profile_path?: string;
  };

interface WatchViewProps {
  selectedMedia: MediaItem;
  bookmarks: BookmarkItem[];
  currentSeason: number;
  currentEpisode: number;
  seasons: Season[];
  episodes: Episode[];
  playerKey: number;
  getPlayerUrl: () => string;
  onBack: () => void;
  toggleBookmark: (media: MediaItem) => void;
  changeSeason: (season: number) => void;
  changeEpisode: (episode: number) => void;
  onViewDetails: (media: MediaItem) => void;
}

export const WatchView: React.FC<WatchViewProps> = ({
  selectedMedia,
  bookmarks,
  currentSeason,
  currentEpisode,
  seasons,
  episodes,
  playerKey,
  getPlayerUrl,
  onBack,
  toggleBookmark,
  changeSeason,
  changeEpisode,
  onViewDetails,
}) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{selectedMedia.title || selectedMedia.name}</h1>
              {selectedMedia.media_type === 'tv' && (
                <p className="text-sm text-zinc-400">
                  Season {currentSeason} · Episode {currentEpisode}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark(selectedMedia)}
              className="hover:bg-white/10"
            >
              {bookmarks.some((b) => b.id === selectedMedia.id) ? (
                <BookmarkCheck className="w-5 h-5 text-white fill-white" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-16">
        <div className="aspect-video bg-black">
          <iframe
            key={playerKey}
            src={getPlayerUrl()}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen={true}
            style={{ border: 'none' }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4 text-center">
                    <Star className="w-6 h-6 fill-yellow-500 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{selectedMedia.vote_average?.toFixed(1)}</p>
                    <p className="text-xs text-zinc-500">Rating</p>
                  </CardContent>
                </Card>
                {selectedMedia.media_type === 'movie' && selectedMedia.runtime && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{Math.floor(selectedMedia.runtime / 60)}h {selectedMedia.runtime % 60}m</p>
                      <p className="text-xs text-zinc-500">Runtime</p>
                    </CardContent>
                  </Card>
                )}
                {selectedMedia.media_type === 'tv' && selectedMedia.number_of_seasons && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4 text-center">
                      <Tv className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedMedia.number_of_seasons}</p>
                      <p className="text-xs text-zinc-500">Seasons</p>
                    </CardContent>
                  </Card>
                )}
                {selectedMedia.media_type === 'tv' && selectedMedia.number_of_episodes && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4 text-center">
                      <Film className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedMedia.number_of_episodes}</p>
                      <p className="text-xs text-zinc-500">Episodes</p>
                    </CardContent>
                  </Card>
                )}
                {(selectedMedia.release_date || selectedMedia.first_air_date) && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {selectedMedia.release_date?.split('-')[0] || selectedMedia.first_air_date?.split('-')[0]}
                      </p>
                      <p className="text-xs text-zinc-500">Year</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {selectedMedia.tagline && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <p className="text-lg italic text-center">"{selectedMedia.tagline}"</p>
                  </CardContent>
                </Card>
              )}
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-indigo-500" />
                      Overview
                    </h3>
                    <p className="text-zinc-300 leading-relaxed">
                      {selectedMedia.overview || 'No description available for this title.'}
                    </p>
                  </div>
                  
                  {selectedMedia.genres && selectedMedia.genres.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-zinc-400">Genres</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMedia.genres.map((genre: { id: number; name: string }) => (
                          <Badge key={genre.id} variant="outline" className="border-zinc-700 text-zinc-300">
                            {genre.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedMedia.credits && selectedMedia.credits.cast && selectedMedia.credits.cast.length > 0 && (
                    <div className="pt-6 border-t border-zinc-800">
                      <h4 className="text-lg font-semibold mb-4">Top Cast</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {selectedMedia.credits.cast.slice(0, 8).map((actor: CastMember) => (
                          <div key={actor.id} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50">
                            {actor.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                alt={actor.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-xs font-bold text-zinc-500">{actor.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{actor.name}</p>
                              <p className="text-xs text-zinc-500 truncate">{actor.character}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedMedia.similar && selectedMedia.similar.results && selectedMedia.similar.results.length > 0 && (
                    <div className="pt-6 border-t border-zinc-800">
                      <h4 className="text-lg font-semibold mb-4">Similar Titles</h4>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {selectedMedia.similar.results.slice(0, 6).map((similar: MediaItem) => (
                          <div
                            key={similar.id}
                            className="cursor-pointer group"
                            onClick={() => {
                                onViewDetails(similar)
                            }}
                          >
                            <div className="aspect-[2/3] rounded-md overflow-hidden bg-zinc-800 relative">
                              {similar.poster_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w342${similar.poster_path}`}
                                  alt={similar.title || similar.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                  <Film className="w-8 h-8 text-zinc-600" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="transform group-hover:scale-100 transition-transform duration-300">
                                  <Play className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" />
                                </div>
                              </div>
                            </div>
                            <p className="text-xs mt-2 truncate text-zinc-400">{similar.title || similar.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
          </div>

          {selectedMedia.media_type === 'tv' && (
            <div className="lg:col-span-1 order-1 lg:order-2">
              <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Episodes</h3>
                    {seasons.length > 0 && (
                      <Select
                        value={currentSeason.toString()}
                        onValueChange={(v) => changeSeason(parseInt(v))}
                      >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {seasons
                            .filter((s: Season) => s.season_number > 0)
                            .map((season: Season) => (
                              <SelectItem key={season.id} value={season.season_number.toString()}>
                                Season {season.season_number}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2">
                      {episodes.map((episode: Episode) => (
                        <div
                          key={episode.id}
                          onClick={() => changeEpisode(episode.episode_number)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            episode.episode_number === currentEpisode
                              ? 'bg-indigo-600/20 border border-indigo-600/50'
                              : 'hover:bg-zinc-800'
                          }`}
                        >
                          <div className="flex gap-3">
                            {episode.still_path && (
                              <div className="w-24 aspect-video bg-zinc-800 rounded overflow-hidden flex-shrink-0 relative">
                                <img
                                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                                  alt={episode.name}
                                  className="w-full h-full object-cover"
                                />
                                {episode.episode_number === currentEpisode && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                    <div className="transform group-hover:scale-100 transition-transform duration-300">
                                      <Play className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-1">
                                <span className="font-bold text-sm text-indigo-500">
                                  {episode.episode_number}.
                                </span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm line-clamp-1">{episode.name}</h4>
                                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                                    {episode.overview || 'No description'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
