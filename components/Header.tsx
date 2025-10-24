
import React, { useState, useEffect, useMemo } from 'react';
import { StarIcon } from './icons';
import { BannerContent } from '../types';

type ActiveView = 'feed' | 'profile' | 'admin' | 'favorites' | 'about' | 'terms' | 'contact' | 'disclaimer';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  userAvatar: string;
  favoriteStarAvatars: string[];
  isAdmin: boolean;
  isBannerVisible: boolean;
  bannerContent?: BannerContent;
  onDismissBanner: () => void;
  onReopenBanner: () => void;
  siteName: string;
  logoUrl: string | null;
}

// FIX: Changed to a named export to resolve module resolution issues.
export const Header: React.FC<HeaderProps> = ({ 
  activeView, 
  setActiveView, 
  userAvatar, 
  favoriteStarAvatars, 
  isAdmin, 
  isBannerVisible, 
  bannerContent,
  onDismissBanner,
  onReopenBanner,
  siteName,
  logoUrl
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
  }, [isFlipped, allAvatars]); // Dependency on the memoized avatar list.
  
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
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40 shadow-lg animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('feed')}>
            {logoUrl ? (
              <img src={logoUrl} alt={`${siteName} Logo`} className="h-10 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <StarIcon className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white tracking-wider">
                  {siteName}
                </span>
              </div>
            )}
          </div>
          
          <div className="hidden sm:flex items-center space-x-2 bg-slate-700/50 p-1 rounded-lg">
            {navItems.slice(0, 2).map(item => (
                 <button key={item.id} onClick={() => setActiveView(item.id)} className={getDesktopTabStyle(item.id)}>
                    {item.label}
                </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center space-x-2 bg-slate-700/50 p-1 rounded-lg">
                {navItems.slice(2).map(item => (
                    <button key={item.id} onClick={() => setActiveView(item.id)} className={getDesktopTabStyle(item.id)}>
                        {item.label}
                    </button>
                ))}
             </div>
             
             <div 
                className="relative h-10 w-10 cursor-pointer" 
                style={{ perspective: '1000px' }}
                onClick={() => setActiveView('profile')}
                title="View Profile"
             >
                <div 
                    className="relative w-full h-full transition-transform duration-1000" 
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                    {/* Front of the card */}
                    <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                        <img 
                            className="h-10 w-10 rounded-full border-2 border-purple-400 object-cover"
                            src={frontAvatar}
                            alt="User profile"
                        />
                    </div>
                    {/* Back of the card */}
                    <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                         <img 
                            className="h-10 w-10 rounded-full border-2 border-teal-400 object-cover"
                            src={backAvatar}
                            alt="Favorite star"
                        />
                    </div>
                </div>
            </div>
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

      {/* Mobile Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 p-1 z-50 flex justify-around">
        {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveView(item.id)} className={getMobileTabStyle(item.id)}>
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
        ))}
      </nav>
    </header>
  );
};
