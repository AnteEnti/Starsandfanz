import React from 'react';

export type AdminView = 'dashboard' | 'posts' | 'media' | 'users' | 'actions' | 'settings';

interface AdminSidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
}

const navItems: { id: AdminView; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'posts', label: 'Posts', icon: 'article' },
  { id: 'media', label: 'Media', icon: 'perm_media' },
  { id: 'users', label: 'Users', icon: 'group' },
  { id: 'actions', label: 'Actions', icon: 'notifications' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView }) => {
  const getButtonStyle = (view: AdminView) => {
    const baseStyle = "w-full flex items-center space-x-3 px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200";
    if (activeView === view) {
      return `${baseStyle} bg-purple-600 text-white`;
    }
    return `${baseStyle} text-slate-300 hover:bg-slate-700`;
  };

  return (
    <aside className="w-full md:w-56 bg-slate-800 rounded-lg shadow-xl p-4 flex-shrink-0">
      <nav className="flex flex-row md:flex-col gap-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`${getButtonStyle(item.id)} flex-1 md:flex-none`}
          >
            <span className="material-symbols-outlined text-base">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;