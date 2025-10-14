import React from 'react';

interface FavoriteCategoryProps {
  title: string;
  items: string[];
  icon: string;
  color: string;
  placeholder: string;
}

const FavoriteCategory: React.FC<FavoriteCategoryProps> = ({ title, items, icon, color, placeholder }) => (
  <div>
    <h3 className={`flex items-center text-lg font-semibold mb-2 ${color}`}>
      <span className="material-symbols-outlined mr-2">{icon}</span>
      {title}
    </h3>
    {items.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className="bg-slate-700 text-slate-200 text-sm font-medium px-3 py-1 rounded-full">
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-slate-500 italic">{placeholder}</p>
    )}
  </div>
);

interface FavoritesSectionProps {
  stars: string[];
  movies: string[];
  genres: string[];
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ stars, movies, genres }) => {
  return (
    <section className="bg-slate-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">Your Favorites</h2>
      <div className="space-y-4">
        <FavoriteCategory 
          title="Favorite Stars"
          items={stars}
          icon="groups"
          color="text-amber-400"
          placeholder="No favorite stars selected."
        />
        <FavoriteCategory 
          title="Favorite Movies"
          items={movies}
          icon="theaters"
          color="text-sky-400"
          placeholder="No favorite movies selected."
        />
        <FavoriteCategory 
          title="Favorite Genres"
          items={genres}
          icon="movie"
          color="text-rose-400"
          placeholder="No favorite genres selected."
        />
      </div>
    </section>
  );
};

export default FavoritesSection;