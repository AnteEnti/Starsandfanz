import React, { useState, useMemo } from 'react';
import { Post, PostType } from '../types';
import AdminSidebar, { AdminView } from './admin/AdminSidebar';
import DashboardView from './admin/DashboardView';
import PostManagementView from './admin/PostManagementView';
import UserManagementView from './admin/UserManagementView';
import MediaView from './admin/MediaView';
import SettingsView from './admin/SettingsView';
import ActionsView from './admin/ActionsView';
import { BannerContent } from '../App';
import ContentManagementView from './admin/ContentManagementView';

interface AdminPageProps {
  posts: Post[];
  onAddPost: (postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  bannerContent: BannerContent;
  onUpdateBannerContent: (newContent: BannerContent) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ posts, onAddPost, onUpdatePost, onDeletePost, bannerContent, onUpdateBannerContent }) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  
  // State for PostManagementView is now managed here
  const [postManagementSubView, setPostManagementSubView] = useState<'list' | 'form'>('list');
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  const { allMovies, allCelebrities } = useMemo(() => {
    const movies = new Map<string, string>();
    const celebrities = new Map<string, string>();

    posts.forEach(p => {
        if (p.type === PostType.MovieDetails && p.movieDetails?.id && p.movieDetails.title) {
            movies.set(p.movieDetails.id, p.movieDetails.title);
        }
        if (p.type === PostType.Celebrity && p.celebrityDetails?.id && p.celebrityDetails.name) {
            celebrities.set(p.celebrityDetails.id, p.celebrityDetails.name);
        }
    });

    return {
        allMovies: Array.from(movies.entries()).map(([id, title]) => ({ id, title })),
        allCelebrities: Array.from(celebrities.entries()).map(([id, name]) => ({ id, name })),
    };
  }, [posts]);

  const handleEditPost = (post: Post) => {
    setPostToEdit(post);
    setPostManagementSubView('form');
    setActiveView('posts');
  };
  
  const handleCreateNewPost = () => {
    setPostToEdit(null);
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
  
  const handleCreatePostFromAction = (template: Partial<Post>) => {
    // This creates a template for a new post, so it has no ID.
    // The `postToEdit` state will hold this template.
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
        return <ActionsView posts={posts} onCreatePost={handleCreatePostFromAction} />;
      case 'content':
        return <ContentManagementView
                  bannerContent={bannerContent}
                  onUpdateBannerContent={onUpdateBannerContent} 
                />;
      case 'settings':
        return <SettingsView />;
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