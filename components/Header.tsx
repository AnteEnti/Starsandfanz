import React from 'react';
import { StarIcon } from './icons';

interface HeaderProps {
  activeView: 'feed' | 'profile' | 'admin';
  setActiveView: (view: 'feed' | 'profile' | 'admin') => void;
  userAvatar: string;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, userAvatar, isAdmin }) => {
  const getTabStyle = (view: 'feed' | 'profile' | 'admin') => {
    const baseStyle = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800";
    if (activeView === view) {
      return `${baseStyle} bg-purple-600 text-white`;
    }
    return `${baseStyle} text-slate-300 hover:bg-slate-700`;
  };

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <StarIcon className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white tracking-wider">
              Star Sphere
            </span>
          </div>
          
          <div className="hidden sm:flex items-center space-x-2 bg-slate-700/50 p-1 rounded-lg">
            <button onClick={() => setActiveView('feed')} className={getTabStyle('feed')}>
              Feed
            </button>
            <button onClick={() => setActiveView('profile')} className={getTabStyle('profile')}>
              Profile
            </button>
            {isAdmin && (
              <button onClick={() => setActiveView('admin')} className={getTabStyle('admin')}>
                Admin
              </button>
            )}
          </div>

          <div className="flex items-center">
            <img 
              className="h-10 w-10 rounded-full border-2 border-purple-400 object-cover"
              src={userAvatar}
              alt="User profile"
            />
          </div>
        </div>
        
        {/* Tabs for mobile view */}
        <div className="sm:hidden flex items-center justify-center space-x-2 bg-slate-700/50 p-1 rounded-lg mb-2">
            <button onClick={() => setActiveView('feed')} className={`${getTabStyle('feed')} flex-1`}>
              Feed
            </button>
            <button onClick={() => setActiveView('profile')} className={`${getTabStyle('profile')} flex-1`}>
              Profile
            </button>
             {isAdmin && (
              <button onClick={() => setActiveView('admin')} className={`${getTabStyle('admin')} flex-1`}>
                Admin
              </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;