

import React, { useState, useEffect, useMemo } from 'react';
import { StarIcon } from './icons';
import { BannerContent } from '../types';
import HypeMeter from './HypeMeter';

type ActiveView = 'feed' | 'profile' | 'admin' | 'favorites' | 'about' | 'terms' | 'contact' | 'disclaimer';

interface HeaderProps {
  setActiveView: (view: ActiveView) => void;
  userAvatar: string;
  favoriteStarAvatars: string[];
  isBannerVisible: boolean;
  bannerContent?: BannerContent;
  onDismissBanner: () => void;
  onReopenBanner: () => void;
  siteName: string;
  logoUrl: string | null;
  hypeLevel: number;
  maxHypeLevel: number;
  isCelebrationModeActive: boolean;
  isScrolled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  setActiveView, 
  userAvatar, 
  favoriteStarAvatars, 
  isBannerVisible, 
  bannerContent,
  onDismissBanner,
  onReopenBanner,
  siteName,
  logoUrl,
  hypeLevel,
  maxHypeLevel,
  isCelebrationModeActive,
  isScrolled,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  
  // Create a memoized list of all avatars to show. This array's reference will only change
  // when the user's avatar or their favorite stars change.
  const allAvatars = useMemo(() => [userAvatar, ...favoriteStarAvatars], [userAvatar, favoriteStarAvatars]);
  
  const frontAvatar = allAvatars[avatarIndex % allAvatars.length];
  const backAvatar = allAvatars.length > 1 ? allAvatars[(avatarIndex + 1) % allAvatars.length] : frontAvatar;

  // This effect now depends directly on the `allAvatars` array. When its reference changes,
  // the animation state is fully reset, and a new animation interval is created.
  useEffect(() => {
    // When the list of avatars changes, reset the animation state.
    setAvatarIndex(0);
    setIsFlipped(false);

    if (allAvatars.length <= 1) {
      return; // No need for an interval if there's only one image.
    }

    const flipInterval = setInterval(() => {
        setIsFlipped(current => !current);
    }, 4000); // Flip every 4 seconds

    return () => clearInterval(flipInterval);
  }, [allAvatars]); // Dependency on the memoized avatar list.

  // This effect handles swapping the underlying image source mid-animation.
  // It also depends on `allAvatars` to ensure it uses the latest list.
  useEffect(() => {
    if (allAvatars.length <= 1 || !isFlipped) return;

    // When the card flips to its back, set a timer to update the avatar index.
    const swapTimer = setTimeout(() => {
        // Use a functional update to get the latest index and array length
        setAvatarIndex(current => (current + 1) % allAvatars.length);
    }, 500); // Half of the 1s animation duration

    return () => clearTimeout(swapTimer);
  }, [isFlipped, allAvatars]);

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40 shadow-lg animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
          <div className="flex items-center space-x-3 cursor-pointer min-w-0" onClick={() => setActiveView('feed')}>
            {logoUrl ? (
              <img src={logoUrl} alt={`${siteName} Logo`} className={`w-auto transition-all duration-300 ${isScrolled ? 'h-8' : 'h-10'}`} />
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <StarIcon className={`text-purple-400 flex-shrink-0 transition-all duration-300 ${isScrolled ? 'h-7 w-7' : 'h-8 w-8'}`} />
                <span className={`font-bold text-white tracking-wider truncate transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
                  {siteName}
                </span>
              </div>
            )}
          </div>
          
          <div className={`hidden md:flex flex-1 justify-center px-4 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <HypeMeter 
              hypeLevel={hypeLevel} 
              maxHypeLevel={maxHypeLevel} 
              isCelebrationModeActive={isCelebrationModeActive}
            />
          </div>

          <div className="flex items-center gap-4">
             <button 
                className={`relative transition-all duration-300 ${isScrolled ? 'h-9 w-9' : 'h-10 w-10'} bg-transparent border-none p-0 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800`}
                style={{ perspective: '1000px' }}
                onClick={() => setActiveView('profile')}
                aria-label="View Profile"
             >
                <div 
                    className="relative w-full h-full transition-transform duration-1000" 
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                    {/* Front of the card */}
                    <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                        <img 
                            className="h-full w-full rounded-full border-2 border-purple-400 object-cover"
                            src={frontAvatar}
                            alt="User profile"
                        />
                    </div>
                    {/* Back of the card */}
                    <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                         <img 
                            className="h-full w-full rounded-full border-2 border-teal-400 object-cover"
                            src={backAvatar}
                            alt="Favorite star"
                        />
                    </div>
                </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Minimized Banner */}
      {isBannerVisible && bannerContent && (
         <div className="bg-slate-900/80 backdrop-blur-sm py-2 px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3" onClick={onReopenBanner} role="button">
                <span className="material-symbols-outlined text-yellow-400 animate-pulse">celebration</span>
                <p className="text-sm font-semibold text-white truncate">
                    <span className="font-black text-yellow-300">{bannerContent.headline1}</span> {bannerContent.headline2}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onReopenBanner}
                    className="text-sm text-purple-300 font-bold whitespace-nowrap hover:underline"
                >
                    Expand
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDismissBanner(); }}
                    className="text-slate-400 hover:text-white"
                    aria-label="Dismiss banner permanently"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>
         </div>
      )}
    </header>
  );
};