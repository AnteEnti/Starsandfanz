import React from 'react';
import { Suggestion } from '../types';
import SuggestionCard from './SuggestionCard';

interface FannedItemsProps {
  fannedItems: Suggestion[];
  onToggleFan: (suggestionId: string) => void;
  onStartUnfan: (suggestionId: string, suggestionName: string) => void;
}

const FannedItems: React.FC<FannedItemsProps> = ({ fannedItems, onToggleFan, onStartUnfan }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-4">Your Fanned Items</h2>
      {fannedItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {fannedItems.map(item => (
            <SuggestionCard
              key={item.id}
              suggestion={item}
              onToggleFan={onToggleFan}
              onStartUnfan={onStartUnfan}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-800 rounded-lg">
          <p className="text-slate-400">You haven't fanned any topics or celebs yet.</p>
          <p className="text-sm text-slate-500 mt-2">Click the 'Fan' button on suggestions to add them!</p>
        </div>
      )}
    </section>
  );
};

export default FannedItems;