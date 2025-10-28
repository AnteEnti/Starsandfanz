import React, { useMemo } from 'react';

export type AdminView = 
  'dashboard' | 
  'posts' | 
  'media' | 
  'users' | 
  'actions' | 
  'banners' | 
  'branding' |
  'settings' | 
  'ai_copilot' |
  'api_keys' |
  'analytics_overview' |
  'analytics_user_growth' |
  'analytics_popular_posts';

interface AdminSidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  isAdmin: boolean;
}

const navItems: ({ id: AdminView; label: string; icon: string; isSubItem?: boolean; adminOnly?: boolean } | { type: 'heading', label: string })[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'posts', label: 'Posts', icon: 'article' },
  { id: 'media', label: 'Media', icon: 'perm_media' },
  { id: 'users', label: 'Users', icon: 'group', adminOnly: true },
  { id: 'actions', label: 'Actions', icon: 'notifications' },
  { id: 'ai_copilot', label: 'AI Co-Pilot', icon: 'smart_toy' },
  { id: 'api_keys', label: 'API Keys', icon: 'vpn_key', adminOnly: true },
  { id: 'banners', label: 'Banners', icon: 'view_carousel' },
  { id: 'branding', label: 'Branding', icon: 'palette' },
  { type: 'heading', label: 'Analytics' },
  { id: 'analytics_overview', label: 'Overview', icon: 'monitoring', isSubItem: true },
  { id: 'analytics_user_growth', label: 'User Growth', icon: 'trending_up', isSubItem: true, adminOnly: true },
  { id: 'analytics_popular_posts', label: 'Popular Posts', icon: 'whatshot', isSubItem: true },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView, isAdmin }) => {
  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => {
      if ('adminOnly' in item && item.adminOnly && !isAdmin) {
        return false;
      }
      return true;
    });
  }, [isAdmin]);

  const getButtonStyle = (view: AdminView, isSubItem?: boolean) => {
    let baseStyle = "w-full flex items-center space-x-3 px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200";
    if (isSubItem) {
        // Indent sub-items and make them slightly smaller
        baseStyle = "w-full flex items-center space-x-3 pl-8 pr-4 py-2 text-left text-sm font-medium rounded-lg transition-colors duration-200";
    }
    
    if (activeView === view) {
      return `${baseStyle} bg-purple-600 text-white`;
    }
    return `${baseStyle} text-slate-300 hover:bg-slate-700`;
  };

  return (
    <aside className="w-full md:w-56 bg-slate-800 rounded-lg shadow-xl p-4 flex-shrink-0">
      <nav className="flex flex-row md:flex-col gap-1 md:gap-2">
        {filteredNavItems.map((item) => {
            if ('type' in item && item.type === 'heading') {
                return (
                    <h3 key={item.label} className="mt-4 mb-1 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:block">
                        {item.label}
                    </h3>
                );
            }
            const { id, label, icon, isSubItem } = item as { id: AdminView; label: string; icon: string; isSubItem?: boolean };
            return (
                <button
                    key={id}
                    onClick={() => setActiveView(id)}
                    className={`${getButtonStyle(id, isSubItem)} flex-1 md:flex-none`}
                >
                    <span className="material-symbols-outlined text-base">{icon}</span>
                    <span className="hidden md:inline">{label}</span>
                </button>
            );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;