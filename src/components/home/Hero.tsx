import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Play, Info } from 'lucide-react';
import { MediaItem } from '@/App';

interface HeroProps {
  heroIndex: number;
  heroTransition: boolean;
  trending: MediaItem[];
  heroDetails: MediaItem[];
  onStartWatching: (media: MediaItem) => void;
  onViewDetails: (media: MediaItem) => void;
}

export const Hero: React.FC<HeroProps> = ({
  heroIndex,
  heroTransition,
  trending,
  heroDetails,
  onStartWatching,
  onViewDetails,
}) => {
  const HERO_SLIDE_COUNT = 5;
  const heroSlides = trending.slice(0, HERO_SLIDE_COUNT);
  const heroDetailsForSlides = heroDetails.slice(0, HERO_SLIDE_COUNT);
  const canCreateLoop = heroSlides.length === HERO_SLIDE_COUNT && heroDetailsForSlides.length === HERO_SLIDE_COUNT;
  const heroItemsToRender = canCreateLoop ? [...heroSlides, heroSlides[0]] : heroSlides;
  const heroDetailsToRender = canCreateLoop ? [...heroDetailsForSlides, heroDetailsForSlides[0]] : heroDetailsForSlides;

  return (
    <div className="absolute top-0 left-0 h-screen w-full overflow-hidden z-10">
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${heroIndex * 100}%)`,
          transition: heroTransition ? 'transform 700ms ease-in-out' : 'none',
        }}
      >
        {heroItemsToRender.map((item: MediaItem, index: number) => {
          const detailedItem = heroDetailsToRender[index] || item;
          const logoPath = detailedItem.images?.logos?.[0]?.file_path || detailedItem.belongs_to_collection?.logo_path;
          return (
            <div key={`hero-${item.id}-${index}`} className="relative h-full w-full flex-shrink-0">
              <div className="absolute inset-0">
                {item.backdrop_path ? (
                  <>
                    <img
                      src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-zinc-900" />
                )}
              </div>
              <div className="relative container mx-auto px-8 h-full flex items-end pb-32">
                <div className="max-w-3xl space-y-6">
                  {logoPath && (
                    <img
                      src={`https://image.tmdb.org/t/p/original${logoPath}`}
                      alt={item.title || item.name}
                      className="max-h-[80px] md:max-h-[100px] w-auto object-contain"
                      style={{ filter: 'drop-shadow(0 4px 30px rgba(0,0,0,0.9))' }}
                    />
                  )}
                  <div className="flex items-center gap-4 text-base">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-xl shadow-2xl shadow-yellow-500/30 border border-yellow-400/30">
                      <Star className="w-5 h-5 fill-white text-white" />
                      <span className="text-white font-bold">{item.vote_average?.toFixed(1)}</span>
                    </div>
                    <span className="text-white font-semibold drop-shadow-2xl text-lg">
                      {(item.release_date || item.first_air_date)?.split('-')[0]}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 backdrop-blur-sm text-white text-sm font-bold rounded-xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/30">
                      {item.media_type === 'tv' ? 'TV SERIES' : 'MOVIE'}
                    </span>
                  </div>
                  <p className="text-white text-lg line-clamp-4 leading-relaxed max-w-2xl drop-shadow-lg">
                    {item.overview}
                  </p>
                  {detailedItem.genres && detailedItem.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {detailedItem.genres.slice(0, 4).map((genre: { id: number; name: string }) => (
                        <span key={genre.id} className="px-4 py-2 bg-zinc-900/80 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-zinc-600 shadow-lg hover:border-cyan-500 hover:bg-zinc-800/80 transition-all">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-12 py-7 text-lg rounded-xl shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-cyan-500/70 border border-cyan-400/30"
                      onClick={() => onStartWatching(item)}
                    >
                      <Play className="w-6 h-6 mr-2" fill="currentColor" />
                      Play Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-zinc-500 bg-zinc-900/80 backdrop-blur-md hover:bg-zinc-800/90 hover:border-cyan-400 hover:text-cyan-400 text-white font-bold px-12 py-7 text-lg rounded-xl shadow-2xl transition-all hover:scale-105"
                      onClick={() => onViewDetails(item)}
                    >
                      <Info className="w-6 h-6 mr-2" />
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
