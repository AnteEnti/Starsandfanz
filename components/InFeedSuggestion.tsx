import React from 'react';
import { Suggestion } from '../types';

interface InFeedSuggestionProps {
  suggestion: Suggestion;
  onToggleFan: (suggestionId: string) => void;
}

const InFeedSuggestion: React.FC<InFeedSuggestionProps> = ({ suggestion, onToggleFan }) => {
  const { id, name, avatar, type } = suggestion;

  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden w-full border border-slate-700 p-5">
      <h3 className="text-sm font-bold text-purple-300 mb-4 uppercase tracking-wider">You Might Like</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full border-2 border-slate-600 object-cover flex-shrink-0" />
        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-lg font-bold text-white">{name}</h4>
          <p className="text-sm text-slate-400">{type}</p>
        </div>
        <button
          onClick={() => onToggleFan(id)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 font-semibold py-2 px-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500"
          aria-label={`Fan ${name}`}
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>Fan</span>
        </button>
      </div>
    </div>
  );
};

export default InFeedSuggestion;
