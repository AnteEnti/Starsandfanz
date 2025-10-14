import React from 'react';
import { FanzSay } from '../types';

interface CommentSectionProps {
  fanzSays?: FanzSay[];
  onFanzSay: (fanzSayId: string) => void;
  currentUserAvatar: string;
}

const MAX_DISPLAY_FANS = 5;

const CommentSection: React.FC<CommentSectionProps> = ({ fanzSays, onFanzSay, currentUserAvatar }) => {
  if (!fanzSays || fanzSays.length === 0) {
    return null;
  }

  // Filter and sort the sayings that have fans
  const sayingsWithFans = fanzSays
    .filter(fs => fs.fans.length > 0)
    .sort((a, b) => b.fans.length - a.fans.length);

  return (
    <div className="mt-4">
      {/* Display aggregated sayings with fan avatars */}
      <div className="space-y-3">
        {sayingsWithFans.map(fs => {
          const userHasSaid = fs.fans.includes(currentUserAvatar);
          const otherFans = fs.fans.filter(fan => fan !== currentUserAvatar);
          const displayFans = userHasSaid ? [currentUserAvatar, ...otherFans] : fs.fans;
          const topFans = displayFans.slice(0, MAX_DISPLAY_FANS);
          const remainingFansCount = fs.fans.length - topFans.length;

          return (
            <div key={fs.id} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-300 flex-shrink truncate">
                <span className="font-bold text-purple-300">{fs.fans.length.toLocaleString()}</span> fans say: <span className="italic">"{fs.text}"</span>
              </p>
              <div className="flex items-center flex-shrink-0">
                  <div className="flex -space-x-3">
                      {topFans.map((fanAvatar, index) => (
                          <img
                              key={`${fs.id}-fan-${index}`}
                              className={`h-8 w-8 rounded-full object-cover ring-2 ring-slate-800 ${fanAvatar === currentUserAvatar ? 'ring-purple-500' : 'ring-slate-600'}`}
                              src={fanAvatar}
                              alt={`Fan avatar`}
                          />
                      ))}
                  </div>
                  {remainingFansCount > 0 && (
                      <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-purple-300 ring-2 ring-slate-800 z-10 ml-1">
                          +{remainingFansCount}
                      </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Clickable "Fanz Say" buttons */}
      <div className="mt-5 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 font-semibold mb-3 text-center uppercase tracking-wider">Fanz Say</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {fanzSays.map(fs => {
            const userHasSaid = fs.fans.includes(currentUserAvatar);
            const buttonStyle = userHasSaid
              ? "bg-purple-600 text-white font-semibold"
              : "bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium";

            return (
              <button
                key={fs.id}
                onClick={() => onFanzSay(fs.id)}
                className={`${buttonStyle} text-sm py-1.5 px-3 rounded-full transition-colors duration-200`}
                aria-pressed={userHasSaid}
              >
                {fs.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;