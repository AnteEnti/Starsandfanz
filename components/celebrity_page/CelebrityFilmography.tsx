
import React from 'react';
import { FilmographyItem } from '../../types';
import FilmographyCarousel from '../FilmographyCarousel';

interface CelebrityFilmographyProps {
  filmography: FilmographyItem[];
  onViewMoviePage: (movieId: string) => void;
}

const CelebrityFilmography: React.FC<CelebrityFilmographyProps> = ({ filmography, onViewMoviePage }) => {
  if (filmography.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">Filmography</h2>
      <FilmographyCarousel movies={filmography} onViewMoviePage={onViewMoviePage} />
    </section>
  );
};

export default CelebrityFilmography;
