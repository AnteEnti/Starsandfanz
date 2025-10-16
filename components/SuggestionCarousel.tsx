import React, { useRef } from 'react';
import { Suggestion } from '../types';
import SuggestionCard from './SuggestionCard';

interface SuggestionCarouselProps {
  suggestions: Suggestion[];
  onToggleFan: (suggestionId: string) => void;
  onStartUnfan: (suggestionId: string, suggestionName: string) => void;
}

const SuggestionCarousel: React.FC<SuggestionCarouselProps> = ({ suggestions, onToggleFan, onStartUnfan }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white mb-3">Celebrate Your Star</h2>
      <div className="relative group -mx-4 sm:-mx-6 lg:-mx-8">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-6 lg:px-8"
        >
          {suggestions.map(suggestion => (
            <SuggestionCard 
              key={suggestion.id} 
              suggestion={suggestion} 
              onToggleFan={onToggleFan}
              onStartUnfan={onStartUnfan}
              disappearsOnFan={true}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 lg:left-6 hidden md:flex items-center justify-center bg-slate-900/60 hover:bg-slate-800/80 rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Scroll left"
        >
          <span className="material-symbols-outlined text-2xl text-white">chevron_left</span>
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 lg:right-6 hidden md:flex items-center justify-center bg-slate-900/60 hover:bg-slate-800/80 rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Scroll right"
        >
          <span className="material-symbols-outlined text-2xl text-white">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default SuggestionCarousel;