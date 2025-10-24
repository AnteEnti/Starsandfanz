
import React from 'react';

interface CelebrityHeroProps {
  name: string;
  imageUrl: string;
  knownFor: string;
  isFanned: boolean;
  onFanClick: () => void;
}

const CelebrityHero: React.FC<CelebrityHeroProps> = ({ name, imageUrl, knownFor, isFanned, onFanClick }) => {
  return (
    <header className="relative w-full h-[40vh] min-h-[350px] bg-slate-800">
      <div className="absolute inset-0">
        <img src={imageUrl} alt={`${name} background`} className="w-full h-full object-cover object-top blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
      </div>
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          <img src={imageUrl} alt={`${name} portrait`} className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-full shadow-2xl border-4 border-slate-700 -mb-16 md:mb-0 flex-shrink-0" />
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight text-shadow">{name}</h1>
            <p className="mt-2 text-lg text-purple-300 font-semibold">{knownFor}</p>
            <button
              onClick={onFanClick}
              className={`mt-4 font-bold py-2 px-6 rounded-full transition duration-300 flex items-center space-x-2 text-sm ${
                isFanned
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-white backdrop-blur-sm'
              }`}
            >
              <span className="material-symbols-outlined">{isFanned ? 'check_circle' : 'add'}</span>
              <span>{isFanned ? 'Fanned' : 'Fan'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CelebrityHero;
