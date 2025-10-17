import React from 'react';
import { Reaction } from '../types';

interface ReactionButtonProps {
  reaction: Reaction;
  onClick: (e: React.MouseEvent) => void;
  isAnimating?: boolean;
}

const reactionLabels: { [key: string]: string } = {
  '❤️': 'Love',
  '🥳': 'Seeti Maro / Wissel Podu',
  '🎉': 'Celebrate',
};

const ReactionButton: React.FC<ReactionButtonProps> = ({ reaction, onClick, isAnimating }) => {
  const { emoji, count } = reaction;
  const label = reactionLabels[emoji] || 'React';

  return (
    <>
      <div className="relative group flex justify-center">
        {isAnimating && emoji === '🥳' && (
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full animate-rattle pointer-events-none z-10"
            style={{
              color: '#f2da5b',
              fontFamily: "'Jolly Lodger', cursive",
              fontSize: '4.5rem',
              textAlign: 'center',
              textShadow: '0 4px 0 #000, -2px -2px 0 #f4513d, -3px -3px 0 #f2da5b'
            }}
          >
            🥳
          </div>
        )}
        <button
          onClick={onClick}
          className="flex items-center space-x-2 text-slate-400 hover:text-white rounded-full py-2 px-3 transition-all duration-200 ease-in-out transform hover:bg-slate-700 active:scale-125"
          aria-label={`React with ${label}`}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="font-semibold text-sm">{count.toLocaleString()}</span>
        </button>

        <div 
          className="absolute bottom-full mb-2 w-max px-3 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          role="tooltip"
        >
          {label}
        </div>
      </div>
    </>
  );
};

export default React.memo(ReactionButton);