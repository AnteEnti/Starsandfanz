import React from 'react';
import { MovieDetails } from '../../types';

interface RelatedTitlesProps {
  movies: MovieDetails[];
  onViewMoviePage: (movieId: string) => void;
}

const RelatedTitles: React.FC<RelatedTitlesProps> = ({ movies, onViewMoviePage }) => {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in-up" style={{animationDelay: '250ms'}}>
      <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">You Might Also Like</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {movies.map(movie => (
          <div key={movie.id} className="flex-shrink-0 w-36">
            <button 
                onClick={() => onViewMoviePage(movie.id)}
                className="group w-full text-left"
                aria-label={`View details for ${movie.title}`}
            >
              <div className="rounded-lg overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-52 object-cover" />
              </div>
              <div className="mt-2 text-center">
                <h5 className="text-sm font-semibold text-white truncate group-hover:text-purple-300">{movie.title}</h5>
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedTitles;
