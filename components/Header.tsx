import React, { useState, useEffect, useMemo } from 'react';
import { StarIcon } from './icons';
import { BannerContent } from '../types';
import HypeMeter from './HypeMeter';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from './auth/ProfileMenu';

type ActiveView = 'feed' | 'profile' | 'admin' | 'favorites' | 'about' | 'terms' | 'contact' | 'disclaimer';

interface HeaderProps {
  setActiveView: (view: ActiveView) => void;
  onLoginClick: () => void;
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
  onLoginClick,
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
  const { isAuthenticated, user, logout } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  
  const allAvatars = useMemo(() => {
    if (user) {
      return [user.avatar, ...favoriteStarAvatars];
    }
    return [];
  }, [user, favoriteStarAvatars]);
  
  const frontAvatar = allAvatars[avatarIndex % allAvatars.length];
  const backAvatar = allAvatars.length > 1 ? allAvatars[(avatarIndex + 1) % allAvatars.length] : frontAvatar;

  useEffect(() => {
    setAvatarIndex(0);
    setIsFlipped(false);
    if (allAvatars.length <= 1) {
      return;
    }
    const flipInterval = setInterval(() => {
        setIsFlipped(current => !current);
    }, 4000);
    return () => clearInterval(flipInterval);
  }, [allAvatars]);

  useEffect(() => {
    if (allAvatars.length <= 1 || !isFlipped) return;
    const swapTimer = setTimeout(() => {
        setAvatarIndex(current => (current + 1) % allAvatars.length);
    }, 500);
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
             {isAuthenticated && user ? (
               <div 
                  className={`relative transition-all duration-300 ${isScrolled ? 'h-9 w-9' : 'h-10 w-10'} bg-transparent border-none p-0 cursor-pointer rounded-full focus:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-800`}
                  style={{ perspective: '1000px' }}
                  aria-label="Open user menu"
               >
                  <div 
                      className="relative w-full h-full transition-transform duration-1000" 
                      style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                      <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                          <img 
                              className="h-full w-full rounded-full border-2 border-purple-400 object-cover"
                              src={frontAvatar}
                              alt="User profile"
                          />
                      </div>
                      <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                           <img 
                              className="h-full w-full rounded-full border-2 border-teal-400 object-cover"
                              src={backAvatar}
                              alt="Favorite star"
                          />
                      </div>
                  </div>
                  <div className="absolute inset-0">
                    <ProfileMenu onLogout={logout} onViewProfile={() => setActiveView('profile')} />
                  </div>
              </div>
             ) : (
              <button
                onClick={onLoginClick}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm"
              >
                Log In
              </button>
             )}
          </div>
        </div>
      </div>
      
      {isBannerVisible && bannerContent && (
         <div className="bg-slate-900/80 backdrop-blur-sm py-2 px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0" onClick={onReopenBanner} role="button">
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