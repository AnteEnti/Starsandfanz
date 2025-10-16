import React from 'react';
import { Post } from '../../types';
import CreateEditPostForm from './CreateEditPostForm';

interface PostManagementViewProps {
  posts: Post[];
  onDeletePost: (postId: string) => void;
  // New props to control the view from parent
  view: 'list' | 'form';
  postToEdit: Post | null;
  onEdit: (post: Post) => void;
  onCreateNew: () => void;
  onSave: (postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>) => void;
  onCancel: () => void;
  allMovies: { id: string, title: string }[];
  allCelebrities: { id: string, name: string }[];
}

const PostManagementView: React.FC<PostManagementViewProps> = ({ 
  posts, 
  onDeletePost,
  view,
  postToEdit,
  onEdit,
  onCreateNew,
  onSave,
  onCancel,
  allMovies,
  allCelebrities
}) => {

  const getTotalReactions = (post: Post) => {
    return Object.values(post.reactions).reduce((sum, count) => sum + (count || 0), 0);
  };

  if (view === 'form') {
    return (
      <CreateEditPostForm 
        onSave={onSave} 
        onCancel={onCancel}
        postToEdit={postToEdit}
        allMovies={allMovies}
        allCelebrities={allCelebrities}
      />
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Posts</h2>
        <button
          onClick={onCreateNew}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center space-x-2"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Create New Post</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Content</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Reactions</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                <td className="px-6 py-4 font-medium text-white max-w-sm truncate">
                  {post.content || post.eventDetails?.title || 'Video Post'}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-600 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full">{post.type}</span>
                </td>
                <td className="px-6 py-4">{getTotalReactions(post).toLocaleString()}</td>
                <td className="px-6 py-4">{post.timestamp}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => onEdit(post)} className="font-medium text-purple-400 hover:underline">Edit</button>
                  <button onClick={() => onDeletePost(post.id)} className="font-medium text-rose-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostManagementView;