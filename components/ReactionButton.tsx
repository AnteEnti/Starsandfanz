import React from 'react';
import { ReactionType } from '../types';

interface ReactionButtonProps {
  type: ReactionType;
  count: number;
  onClick: () => void;
  isAnimating?: boolean;
}

const reactionLabels: { [key in ReactionType]: string } = {
  [ReactionType.Love]: 'Love',
  [ReactionType.Celebrate]: 'Celebrate',
  [ReactionType.Whistle]: 'Seeti Maro / Wissel Podu',
};

const ReactionButton: React.FC<ReactionButtonProps> = ({ type, count, onClick, isAnimating }) => {
  return (
    <>
      <div className="relative group flex justify-center">
        {isAnimating && type === ReactionType.Whistle && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full animate-rattle pointer-events-none z-10">
            🥳
          </div>
        )}
        <button
          onClick={onClick}
          className="flex items-center space-x-2 text-slate-400 hover:text-white rounded-full py-2 px-3 transition-all duration-200 ease-in-out transform hover:bg-slate-700 active:scale-125"
          aria-label={`React with ${reactionLabels[type]}`}
        >
          <span className="text-2xl">{type}</span>
          <span className="font-semibold text-sm">{count.toLocaleString()}</span>
        </button>

        <div 
          className="absolute bottom-full mb-2 w-max px-3 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          role="tooltip"
        >
          {reactionLabels[type]}
        </div>
      </div>
      <style>{`
        @keyframes rattle {
          0% {
            transform: translateX(-2px); 
            letter-spacing: -0.012em;
          }
          25% {
            transform: translateY(-2px) rotate(-1deg);
          }
          50% {
            transform: translateX(1px);
            text-shadow: 0 1px 0 #000, 
              1px 1px 0 #f4513d,
              2px 2px 0 #f2da5b,
              -3px -5px 0 #f4513d,
              -4px -6px 0 rgba(242, 218, 91, 0.6);
          }
          75% {
            transform: translateY(1px);
          }
          100% {
            transform: translateY(-2px); 
          }
        }
        .animate-rattle {
          animation: rattle 0.08s infinite alternate;
          color: #f2da5b;
          font-family: 'Jolly Lodger', cursive;
          font-size: 4.5rem;
          text-align: center;
          text-shadow: 0 4px 0 #000, 
            -2px -2px 0 #f4513d,
            -3px -3px 0 #f2da5b;
        }
      `}</style>
    </>
  );
};

export default React.memo(ReactionButton);