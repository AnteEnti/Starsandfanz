import React, { useRef } from 'react';
import { FilmographyItem } from '../types';

interface FilmographyCarouselProps {
  movies: FilmographyItem[];
  onViewMoviePage: (movieId: string) => void;
}

const FilmographyCarousel: React.FC<FilmographyCarouselProps> = ({ movies, onViewMoviePage }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // A smaller scroll amount is better here since cards are smaller
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 px-5 scrollbar-hide"
      >
        {movies.map(movie => (
          <div key={movie.id} className="flex-shrink-0 w-36">
             <button
              onClick={() => movie.linkedMovieId && onViewMoviePage(movie.linkedMovieId)}
              disabled={!movie.linkedMovieId}
              className="group w-full text-left disabled:cursor-default"
              aria-label={`View details for ${movie.title}`}
            >
              <div className="rounded-lg overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300 group-disabled:transform-none">
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-52 object-cover" />
              </div>
              <div className="mt-2 text-center">
                <h5 className="text-sm font-semibold text-white truncate group-hover:text-rose-300 group-disabled:text-white">{movie.title}</h5>
                <p className="text-xs text-slate-400">{movie.year}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute top-1/2 -translate-y-1/2 left-2 hidden md:flex items-center justify-center bg-slate-900/50 hover:bg-slate-800/80 rounded-full p-1.5 transition-opacity opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Scroll left"
      >
        <span className="material-symbols-outlined text-xl text-white">chevron_left</span>
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute top-1/2 -translate-y-1/2 right-2 hidden md:flex items-center justify-center bg-slate-900/50 hover:bg-slate-800/80 rounded-full p-1.5 transition-opacity opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Scroll right"
      >
        <span className="material-symbols-outlined text-xl text-white">chevron_right</span>
      </button>
    </div>
  );
};

export default FilmographyCarousel;