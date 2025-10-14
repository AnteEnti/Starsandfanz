import React, { useState, useMemo } from 'react';
import { UserProfileData } from '../types';

interface EditProfileFormProps {
  currentUser: UserProfileData;
  onSave: (newProfile: UserProfileData) => void;
  onCancel: () => void;
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
}> = ({ title, options, selected, onChange }) => (
  <div>
    <h3 className="text-lg font-semibold text-purple-300 mb-2">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2">
      {options.map(option => (
        <label key={option} className="flex items-center space-x-2 bg-slate-700 p-2 rounded-md cursor-pointer hover:bg-slate-600">
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

const EditProfileForm: React.FC<EditProfileFormProps> = ({ currentUser, onSave, onCancel, favoriteOptions }) => {
  const [formData, setFormData] = useState<UserProfileData>(currentUser);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: keyof Pick<UserProfileData, 'favoriteStars' | 'favoriteMovies' | 'favoriteGenres'>, option: string) => {
    setFormData(prev => {
      const currentSelection = prev[category];
      const newSelection = currentSelection.includes(option)
        ? currentSelection.filter(item => item !== option)
        : [...currentSelection, option];
      return { ...prev, [category]: newSelection };
    });
  };

  const isFormChanged = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(currentUser);
  }, [formData, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4">
            <img 
              src={formData.avatar || 'https://i.pravatar.cc/150'} 
              alt="Avatar preview" 
              className="w-20 h-20 rounded-full border-4 border-slate-600 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // prevent infinite loop
                target.src = 'https://i.pravatar.cc/150?u=error';
              }}
            />
            <div className="flex-1 space-y-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                 <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-slate-300 mb-1">Avatar URL</label>
                  <input
                    type="url"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
            </div>
        </div>

        <CheckboxGroup
          title="Favorite Stars"
          options={favoriteOptions.stars}
          selected={formData.favoriteStars}
          onChange={(option) => handleCheckboxChange('favoriteStars', option)}
        />
        <CheckboxGroup
          title="Favorite Movies"
          options={favoriteOptions.movies}
          selected={formData.favoriteMovies}
          onChange={(option) => handleCheckboxChange('favoriteMovies', option)}
        />
        <CheckboxGroup
          title="Favorite Genres"
          options={favoriteOptions.genres}
          selected={formData.favoriteGenres}
          onChange={(option) => handleCheckboxChange('favoriteGenres', option)}
        />
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-full transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormChanged}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-semibold rounded-full transition duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;