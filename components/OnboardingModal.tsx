import React, { useState } from 'react';
import { UserProfileData } from '../types';
import { StarIcon } from './icons';

interface OnboardingModalProps {
  user: UserProfileData;
  onSave: (newProfile: UserProfileData) => void;
  onClose: () => void;
  favoriteOptions: {
    genres: string[];
    movies: string[];
    stars: string[];
  };
}

const CheckboxGroup: React.FC<{
  title: string;
  options: string[];
  selected: string[];
  onChange: (option: string) => void;
  icon: string;
}> = ({ title, options, selected, onChange, icon }) => (
  <div>
    <h3 className="flex items-center text-lg font-semibold text-purple-300 mb-2">
        <span className="material-symbols-outlined mr-2">{icon}</span>
        {title}
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
      {options.map(option => (
        <label key={option} className="flex items-center space-x-2 bg-slate-700 p-2 rounded-md cursor-pointer hover:bg-slate-600 has-[:checked]:bg-purple-600/50 has-[:checked]:ring-2 has-[:checked]:ring-purple-500 transition-all">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onChange(option)}
            className="form-checkbox h-4 w-4 text-purple-500 bg-slate-800 border-slate-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-slate-200 truncate">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onSave, onClose, favoriteOptions }) => {
  const [formData, setFormData] = useState<UserProfileData>(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (category: keyof Pick<UserProfileData, 'favoriteStars' | 'favoriteMovies' | 'favoriteGenres'>, option: string) => {
    setFormData(prev => {
      const currentSelection = prev[category] || [];
      const newSelection = currentSelection.includes(option)
        ? currentSelection.filter(item => item !== option)
        : [...currentSelection, option];
      return { ...prev, [category]: newSelection };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-bg-enter"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 animate-modal-content-enter max-h-[90vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10 p-1 rounded-full"
          aria-label="Close onboarding"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="text-center mb-6 flex-shrink-0">
          <StarIcon className="h-12 w-12 text-purple-400 mx-auto" />
          <h2 className="text-3xl font-bold text-white mt-4">Welcome to Fanz Adda, {user.name}!</h2>
          <p className="text-slate-400 mt-2">Select your favorites to personalize your feed, or skip for now by closing this window.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-4 -mr-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          <CheckboxGroup
            title="Favorite Stars"
            icon="groups"
            options={favoriteOptions.stars}
            selected={formData.favoriteStars}
            onChange={(option) => handleCheckboxChange('favoriteStars', option)}
          />
          <CheckboxGroup
            title="Favorite Movies"
            icon="theaters"
            options={favoriteOptions.movies}
            selected={formData.favoriteMovies}
            onChange={(option) => handleCheckboxChange('favoriteMovies', option)}
          />
          <CheckboxGroup
            title="Favorite Genres"
            icon="movie"
            options={favoriteOptions.genres}
            selected={formData.favoriteGenres}
            onChange={(option) => handleCheckboxChange('favoriteGenres', option)}
          />
        </form>
        
        <div className="flex-shrink-0 pt-6 mt-4 border-t border-slate-700">
            <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold rounded-full transition duration-300 flex items-center justify-center"
            >
                {isLoading 
                    ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                    : 'Save & Continue to the Celebration!'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;