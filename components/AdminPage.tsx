

import React, { useState, useMemo } from 'react';
import { Post, PostType, Banner, SiteSettings } from '../types';
import AdminSidebar, { AdminView } from './admin/AdminSidebar';
import DashboardView from './admin/DashboardView';
import PostManagementView from './admin/PostManagementView';
import UserManagementView from './admin/UserManagementView';
import MediaView from './admin/MediaView';
import SettingsView from './admin/SettingsView';
import ActionsView from './admin/ActionsView';
import BannerManagementView from './admin/ContentManagementView';
import AIPostGenerator from './admin/AIPostGenerator';
import AnalyticsOverviewView from './admin/analytics/AnalyticsOverviewView';
import UserGrowthView from './admin/analytics/UserGrowthView';
import PopularPostsView from './admin/analytics/PopularPostsView';
import ApiKeysView from './admin/ApiKeysView';
import BrandingView from './admin/BrandingView';

interface AdminPageProps {
  posts: Post[];
  onAddPost: (postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  banners: Banner[];
  onUpdateBanners: (newBanners: Banner[]) => void;
  allMovies: { id: string, title: string }[];
  allCelebrities: { id: string, name: string }[];
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (newSettings: SiteSettings) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ posts, onAddPost, onUpdatePost, onDeletePost, banners, onUpdateBanners, allMovies, allCelebrities, siteSettings, onUpdateSiteSettings }) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  
  const [postManagementSubView, setPostManagementSubView] = useState<'list' | 'form'>('list');
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  const handleEditPost = (post: Post) => {
    setPostToEdit(post);
    setPostManagementSubView('form');
    setActiveView('posts');
  };
  
  const handleCreateNewPost = (type?: PostType) => {
    if (type) {
      // Create a template with the pre-selected type for the form
      setPostToEdit({ type } as Post);
    } else {
      // Global create button - no pre-selected type
      setPostToEdit(null);
    }
    setPostManagementSubView('form');
    setActiveView('posts');
  };

  const handleSavePost = (postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>) => {
    if (postToEdit && postToEdit.id) {
      onUpdatePost({ ...postToEdit, ...postData });
    } else {
      const finalPostData = { ...(postToEdit || {}), ...postData };
      onAddPost(finalPostData as Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>);
    }
    setPostManagementSubView('list');
    setPostToEdit(null);
    // Don't switch active view, stay on posts page
  };
  
  const handleCancelPostForm = () => {
    setPostManagementSubView('list');
    setPostToEdit(null);
  };
  
  const handleCreatePostFromTemplate = (template: Partial<Post>) => {
    setPostToEdit(template as Post);
    setPostManagementSubView('form');
    setActiveView('posts');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView posts={posts} />;
      case 'posts':
        return <PostManagementView 
                  posts={posts} 
                  onDeletePost={onDeletePost} 
                  view={postManagementSubView}
                  postToEdit={postToEdit}
                  onEdit={handleEditPost}
                  onCreateNew={handleCreateNewPost}
                  onSave={handleSavePost}
                  onCancel={handleCancelPostForm}
                  allMovies={allMovies}
                  allCelebrities={allCelebrities}
                />;
      case 'media':
        return <MediaView />;
      case 'users':
        return <UserManagementView />;
      case 'actions':
        return <ActionsView posts={posts} onCreatePost={handleCreatePostFromTemplate} />;
      case 'ai_copilot':
        return <AIPostGenerator 
                 allMovies={allMovies} 
                 allCelebrities={allCelebrities}
                 onCreatePost={handleCreatePostFromTemplate}
               />;
      case 'api_keys':
        return <ApiKeysView />;
      case 'banners':
        return <BannerManagementView
                  banners={banners}
                  onUpdateBanners={onUpdateBanners} 
                />;
      case 'branding':
        return <BrandingView
                  siteSettings={siteSettings}
                  onUpdate={onUpdateSiteSettings}
               />;
      case 'settings':
        return <SettingsView />;
      case 'analytics_overview':
        return <AnalyticsOverviewView />;
      case 'analytics_user_growth':
        return <UserGrowthView />;
      case 'analytics_popular_posts':
        return <PopularPostsView />;
      default:
        return <DashboardView posts={posts} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 w-full bg-slate-800 rounded-lg shadow-xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
