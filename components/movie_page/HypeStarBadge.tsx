import React, { useMemo } from 'react';
import { HypeLogEntry } from '../../types';
import { StarIcon } from '../icons';

interface HypeStarBadgeProps {
  movieId: string;
  movieTitle: string;
  hypeLog: HypeLogEntry[];
  currentUserAvatar: string;
}

const HypeStarBadge: React.FC<HypeStarBadgeProps> = ({ movieId, movieTitle, hypeLog, currentUserAvatar }) => {
  const hypesThisMonth = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return hypeLog.filter(hype => {
      const hypeDate = new Date(hype.timestamp);
      return (
        hype.movieId === movieId &&
        hypeDate.getMonth() === currentMonth &&
        hypeDate.getFullYear() === currentYear
      );
    }).length;
  }, [hypeLog, movieId]);

  if (hypesThisMonth === 0) {
    return null; // Don't show anything if the user hasn't hyped this month
  }

  const badgeTiers: { [key: number]: { name: string; color: string; textColor: string; iconColor: string; } } = {
    1: { name: 'Bronze Hype Star', color: 'bg-yellow-700/50 border-yellow-700', textColor: 'text-yellow-300', iconColor: 'text-yellow-500' },
    2: { name: 'Silver Hype Star', color: 'bg-slate-500/50 border-slate-500', textColor: 'text-slate-200', iconColor: 'text-slate-300' },
    3: { name: 'Gold Hype Star', color: 'bg-amber-500/50 border-amber-500', textColor: 'text-amber-100', iconColor: 'text-amber-300' },
  };

  const currentTier = badgeTiers[hypesThisMonth] || badgeTiers[3]; // Default to gold if > 3

  const handleShare = async () => {
    const shareData = {
      title: 'Star Sphere Badge!',
      text: `I earned the ${currentTier.name} badge for hyping "${movieTitle}" on Star Sphere!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('Badge shared successfully!');
      } else {
        // Fallback for browsers that don't support Web Share API
        alert('Share functionality is not supported in your browser. Copy this text: ' + shareData.text);
      }
    } catch (err) {
      console.error('Error sharing badge:', err);
    }
  };

  return (
    <div className={`rounded-lg p-4 text-center animate-fade-in-up border ${currentTier.color}`}>
      <h3 className="text-lg font-semibold text-white mb-2">Hype Star Badge</h3>
      <div className="relative inline-block">
        <StarIcon className={`w-20 h-20 ${currentTier.iconColor}`} />
        <img src={currentUserAvatar} alt="Your avatar" className="w-10 h-10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-slate-900" />
      </div>
      <p className={`font-bold mt-2 ${currentTier.textColor}`}>{currentTier.name}</p>
      <p className="text-sm text-slate-300 mt-1">
        You've hyped this {hypesThisMonth} time{hypesThisMonth > 1 ? 's' : ''} this month!
      </p>
      <button 
        onClick={handleShare}
        className="mt-4 bg-slate-800/50 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-full text-xs flex items-center gap-2 mx-auto"
      >
        <span className="material-symbols-outlined text-base">share</span>
        Share Badge
      </button>
    </div>
  );
};

export default HypeStarBadge;