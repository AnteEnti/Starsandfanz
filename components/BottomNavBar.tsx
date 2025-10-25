
import React from 'react';

type ActiveView = 'feed' | 'profile' | 'admin' | 'favorites' | 'about' | 'terms' | 'contact' | 'disclaimer';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: string;
}

interface BottomNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  navItems: NavItem[];
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView, navItems }) => {
  const getMobileTabStyle = (view: ActiveView) => {
    const baseStyle = "flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900";
    if (activeView === view) {
      return `${baseStyle} text-purple-300`;
    }
    return `${baseStyle} text-slate-400 hover:bg-slate-700`;
  }

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 p-1 z-50 flex justify-around">
      {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveView(item.id)} className={getMobileTabStyle(item.id)}>
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
      ))}
    </nav>
  );
};

export default BottomNavBar;
