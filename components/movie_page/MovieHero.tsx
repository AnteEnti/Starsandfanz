

import React, { useState } from 'react';
import { StarIcon } from '../icons';
import TrailerModal from './TrailerModal';

interface MovieHeroProps {
  title: string;
  heroImageUrl: string;
  posterUrl: string;
  rating: number;
  genres: string[];
  trailerUrl?: string;
  movieId: string;
  hypeCount: number;
  onHype: () => void;
}

const MovieHero: React.FC<MovieHeroProps> = ({ title, posterUrl, heroImageUrl, rating, genres, trailerUrl, movieId, hypeCount, onHype }) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:embed\/|watch\?v=)?(.+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      // The video ID might have extra query params, so we split by '&' and take the first part
      return match[1].split('&')[0];
    }
    return null;
  };

  const videoId = trailerUrl ? getYouTubeVideoId(trailerUrl) : null;
  const trailerThumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  return (
    <header className="relative w-full h-[50vh] min-h-[400px] md:h-[60vh] lg:h-[70vh] bg-slate-800">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImageUrl}
          alt={`${title} background`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent"></div>
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          <img src={posterUrl} alt={`${title} poster`} className="w-48 rounded-lg shadow-2xl -mb-16 md:mb-0 flex-shrink-0" />
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight text-shadow">{title}</h1>
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
              <div className="flex items-center space-x-1 bg-amber-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                <StarIcon className="h-4 w-4" />
                <span>{rating.toFixed(1)}</span>
              </div>
              {genres.map(genre => (
                <span key={genre} className="bg-slate-700/50 text-xs font-semibold text-slate-200 px-3 py-1 rounded-full backdrop-blur-sm">
                  {genre}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center md:justify-start flex-wrap gap-4">
              {trailerThumbnailUrl && (
                <button onClick={() => setIsTrailerOpen(true)} className="relative group w-40 h-24 rounded-lg overflow-hidden border-2 border-slate-600 hover:border-purple-500 transition-all duration-300 shadow-lg">
                  <img src={trailerThumbnailUrl} alt="Trailer thumbnail" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-900/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined text-4xl text-white">play_arrow</span>
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    Trailer
                  </span>
                </button>
              )}
              <div className="flex items-center gap-2">
                <button className="bg-slate-700/50 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center space-x-2 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-rose-400">favorite</span>
                  <span>Favorite movie</span>
                </button>
                <button 
                  onClick={onHype}
                  disabled={hypeCount === 0}
                  className="bg-yellow-400/20 hover:bg-yellow-400/40 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center space-x-2 backdrop-blur-sm disabled:cursor-not-allowed disabled:bg-slate-700 disabled:opacity-50 group"
                  aria-label={`Hype this movie. ${hypeCount} hypes left this week.`}
                >
                  <span className="material-symbols-outlined text-yellow-300 group-disabled:text-slate-400 animate-glitter">auto_awesome</span>
                  <span>Hype ({hypeCount})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isTrailerOpen && trailerUrl && (
        <TrailerModal 
          trailerUrl={trailerUrl}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </header>
  );
};

export default MovieHero;