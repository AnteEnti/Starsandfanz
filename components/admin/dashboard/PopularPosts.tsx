import React, { useMemo } from 'react';
import { Post } from '../../../types';

interface PopularPostsProps {
  posts: Post[];
}

const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  const popularPosts = useMemo(() => {
    return [...posts]
      .map(post => ({
        ...post,
        totalReactions: post.reactions?.reduce((sum, reaction) => sum + reaction.count, 0) || 0
      }))
      .sort((a, b) => b.totalReactions - a.totalReactions)
      .slice(0, 5);
  }, [posts]);

  return (
    <div className="bg-slate-700/50 p-5 rounded-lg h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Most Popular Posts</h3>
      {popularPosts.length > 0 ? (
        <ul className="space-y-3">
          {popularPosts.map((post, index) => (
            <li key={post.id} className="flex items-center gap-4 text-sm">
              <span className="font-bold text-slate-400 text-lg">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {post.content || post.eventDetails?.title || 'Media Post'}
                </p>
                <p className="text-slate-400 text-xs">{post.type}</p>
              </div>
              <div className="flex items-center gap-1 font-bold text-rose-400">
                <span className="material-symbols-outlined text-base">favorite</span>
                <span>{post.totalReactions.toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 italic">No posts available to rank.</p>
      )}
    </div>
  );
};

export default PopularPosts;