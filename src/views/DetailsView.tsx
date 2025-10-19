import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { MediaItem, BookmarkItem } from '@/App';

type CastMember = {
    id: number;
    name: string;
    character: string;
    profile_path?: string;
  };

interface DetailsViewProps {
  selectedMedia: MediaItem;
  bookmarks: BookmarkItem[];
  onBack: () => void;
  onPlay: (media: MediaItem) => void;
  onViewDetails: (media: MediaItem) => void;
  toggleBookmark: (media: MediaItem) => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
  selectedMedia,
  bookmarks,
  onBack,
  onPlay,
  onViewDetails,
  toggleBookmark,
}) => {
  const isBookmarked = bookmarks.some((b) => b.id === selectedMedia.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedMedia.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 text-white animate-in fade-in duration-500">
      <div
        className="absolute top-0 left-0 w-full h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${selectedMedia.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="absolute top-6 left-4 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all hover:scale-110 rounded-xl h-12 w-12">
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <div className="pt-[40vh] md:pt-[30vh] grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={`https://image.tmdb.org/t/p/w500${selectedMedia.poster_path}`}
              alt={selectedMedia.title || selectedMedia.name}
              className="rounded-xl shadow-2xl w-full"
            />
          </div>
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">{selectedMedia.title || selectedMedia.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-xl shadow-xl shadow-yellow-500/30 border border-yellow-400/30">
                <Star className="w-5 h-5 fill-white text-white" />
                <span className="font-bold text-white">{selectedMedia.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-zinc-400 text-xl">•</span>
              <span className="font-semibold text-lg">{selectedMedia.release_date?.split('-')[0] || selectedMedia.first_air_date?.split('-')[0]}</span>
              {selectedMedia.runtime ? (
                <>
                  <span className="text-zinc-400 text-xl">•</span>
                  <span className="font-semibold text-lg">{`${Math.floor(selectedMedia.runtime / 60)}h ${selectedMedia.runtime % 60}m`}</span>
                </>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMedia.genres?.map((genre) => (
                <Badge key={genre.id} variant="outline" className="border-zinc-600 bg-zinc-900/80 text-white font-semibold px-4 py-2 rounded-full hover:border-cyan-500 hover:bg-zinc-800/80 transition-all">
                  {genre.name}
                </Badge>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed max-w-3xl">{selectedMedia.overview}</p>
            <div className="flex items-center gap-4">
              <Button size="lg" onClick={() => onPlay(selectedMedia)} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-10 py-7 text-lg rounded-xl shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-cyan-500/70 border border-cyan-400/30">
                <Play className="w-6 h-6 mr-2" fill="currentColor" />
                Play
              </Button>
              <Button size="lg" variant="outline" onClick={() => toggleBookmark(selectedMedia)} className="border-2 border-zinc-500 bg-zinc-900/80 backdrop-blur-md hover:bg-zinc-800/90 hover:border-cyan-400 hover:text-cyan-400 text-white font-bold px-10 py-7 text-lg rounded-xl shadow-2xl transition-all hover:scale-105">
                {isBookmarked ? (
                  <BookmarkCheck className="w-6 h-6 mr-2" />
                ) : (
                  <Bookmark className="w-6 h-6 mr-2" />
                )}
                {isBookmarked ? 'In My List' : 'Add to My List'}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-12 space-y-8">
            {selectedMedia.credits?.cast && selectedMedia.credits.cast.length > 0 && (
                 <Card className="bg-zinc-900/80 backdrop-blur-md border-2 border-zinc-700/50 rounded-2xl shadow-2xl">
                 <CardContent className="p-6 space-y-6">
                <div className="pt-6 border-t border-zinc-700">
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
                </CardContent>
              </Card>
            )}

          {selectedMedia.similar?.results && selectedMedia.similar.results.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {selectedMedia.similar.results.map((item) => (
                  <div key={item.id} className="cursor-pointer group" onClick={() => onViewDetails(item)}>
                    <div className="aspect-[2/3] rounded-md overflow-hidden bg-zinc-800 relative">
                      <img
                        src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />

                    </div>
                    <p className="text-sm mt-2 truncate">{item.title || item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
