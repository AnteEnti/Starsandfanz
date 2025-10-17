import React, { useState, useEffect, useMemo } from 'react';
import { StarIcon } from './icons';
import { BannerContent } from '../App';

type ActiveView = 'feed' | 'profile' | 'admin' | 'favorites';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  userAvatar: string;
  favoriteStarAvatars: string[];
  isAdmin: boolean;
  isBannerVisible: boolean;
  bannerContent: BannerContent;
  onDismissBanner: () => void;
  onReopenBanner: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeView, 
  setActiveView, 
  userAvatar, 
  favoriteStarAvatars, 
  isAdmin, 
  isBannerVisible, 
  bannerContent,
  onDismissBanner,
  onReopenBanner
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const allAvatars = useMemo(() => [userAvatar, ...favoriteStarAvatars], [userAvatar, favoriteStarAvatars]);
  
  const frontAvatar = allAvatars[avatarIndex % allAvatars.length];
  const backAvatar = allAvatars.length > 1 ? allAvatars[(avatarIndex + 1) % allAvatars.length] : frontAvatar;

  // Use a stringified version of the array for the dependency.
  // This ensures the effect re-runs when the content of the avatars changes, not just the length.
  const avatarDependency = JSON.stringify(allAvatars);

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
  }, [avatarDependency]); // Dependency on the stringified avatar list.

  useEffect(() => {
    if (allAvatars.length <= 1 || !isFlipped) return;

    // When the card flips to its back, set a timer to update the avatar index.
    const swapTimer = setTimeout(() => {
        // Use a functional update to get the latest index and array length
        setAvatarIndex(current => (current + 1) % allAvatars.length);
    }, 500); // Half of the 1s animation duration

    return () => clearTimeout(swapTimer);
  }, [isFlipped, avatarDependency]); // Dependency on the stringified avatar list.
  
  const navItems: { id: ActiveView; label: string; icon: string }[] = [
    { id: 'feed', label: 'Feed', icon: 'home' },
    { id: 'favorites', label: 'Favorites', icon: 'favorite' },
    { id: 'profile', label: 'Profile', icon: 'person' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: 'admin_panel_settings' } as const] : []),
  ];

  const getDesktopTabStyle = (view: ActiveView) => {
    const baseStyle = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800";
    if (activeView === view) {
      return `${baseStyle} bg-purple-600 text-white`;
    }
    return `${baseStyle} text-slate-300 hover:bg-slate-700`;
  };
  
  const getMobileTabStyle = (view: ActiveView) => {
    const baseStyle = "flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900";
    if (activeView === view) {
      return `${baseStyle} text-purple-300`;
    }
    return `${baseStyle} text-slate-400 hover:bg-slate-700`;
  }

  return (
    <>
      {/* --- Desktop Header --- */}
      <header className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-lg">
        <div className={`transition-all duration-300 ease-out overflow-hidden ${isBannerVisible ? 'max-h-16' : 'max-h-0'}`}>
          <div
            onClick={onReopenBanner}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onReopenBanner(); }}
            role="button"
            tabIndex={0}
            className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 text-slate-900 p-2 text-center text-sm font-semibold flex items-center justify-center gap-4 cursor-pointer group"
          >
            <span className="hidden sm:inline">🎉</span>
            <span className="truncate group-hover:underline">{bannerContent.headline1} <span className="font-black text-white">{bannerContent.headline2}</span></span>
             <span className="hidden sm:inline">🥳</span>
            <button 
              onClick={(e) => { 
                e.stopPropagation();
                onDismissBanner();
              }}
              className="ml-auto flex-shrink-0 p-1 rounded-full hover:bg-black/20 transition-colors"
              aria-label="Dismiss banner"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <StarIcon className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white tracking-wider">
                Stars And Fanz
              </span>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2 bg-slate-700/50 p-1 rounded-lg">
              {navItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveView(item.id)} 
                  className={getDesktopTabStyle(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center">
               <div className="relative w-10 h-10" style={{ perspective: '1000px' }}>
                  <div 
                      className="relative w-full h-full transition-transform duration-1000"
                      style={{
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                  >
                      <img 
                          className="absolute w-full h-full rounded-full border-2 border-purple-400 object-cover"
                          style={{ backfaceVisibility: 'hidden' }}
                          src={frontAvatar}
                          alt="User profile"
                      />
                      <img 
                          className="absolute w-full h-full rounded-full border-2 border-purple-400 object-cover"
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                          src={backAvatar}
                          alt="Favorite star profile"
                      />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Bottom Navigation --- */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 p-1 z-50">
        <div className="flex justify-around">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveView(item.id)} className={getMobileTabStyle(item.id)}>
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;
