import React from 'react';
import { StarIcon } from './icons';

type ActiveView = 'feed' | 'profile' | 'admin' | 'favorites';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  userAvatar: string;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, userAvatar, isAdmin }) => {
  
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
      <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <StarIcon className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white tracking-wider">
                Star Sphere
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
              <img 
                className="h-10 w-10 rounded-full border-2 border-purple-400 object-cover"
                src={userAvatar}
                alt="User profile"
              />
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
