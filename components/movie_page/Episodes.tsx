import React, { useState, useMemo } from 'react';
import { Episode } from '../../types';

interface EpisodesProps {
  episodes: Episode[];
}

const Episodes: React.FC<EpisodesProps> = ({ episodes }) => {
  const seasons = useMemo(() => Array.from(new Set(episodes.map(e => e.season))), [episodes]);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0] || 1);

  const filteredEpisodes = useMemo(() => 
    episodes.filter(e => e.season === selectedSeason), 
  [episodes, selectedSeason]);

  return (
    <section className="animate-fade-in-up" style={{animationDelay: '100ms'}}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-3xl font-bold text-white mb-2 sm:mb-0 border-b-2 border-purple-500/30 pb-2">Episodes</h2>
        {seasons.length > 1 && (
          <div className="flex-shrink-0">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
              aria-label="Select season"
            >
              {seasons.map(season => (
                <option key={season} value={season}>Season {season}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {filteredEpisodes.map(episode => (
          <div key={`${episode.season}-${episode.episodeNumber}`} className="flex-shrink-0 w-64 text-left group bg-slate-800/50 rounded-lg overflow-hidden">
            <div className="w-full h-36 relative">
              <img 
                src={episode.thumbnailUrl} 
                alt={episode.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="material-symbols-outlined text-5xl text-white">play_circle</span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-white truncate">E{episode.episodeNumber} - {episode.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{episode.synopsis}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Episodes;
