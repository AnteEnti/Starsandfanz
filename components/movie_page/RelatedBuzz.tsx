import React from 'react';
import { Post, MovieDetails, CelebrityDetails } from '../types';
import PostCard from '../PostCard';

interface RelatedBuzzProps {
  posts: Post[];
  onReaction: (postId: string, reactionId: string) => void;
  onFanzSay: (postId: string, fanzSayId: string) => void;
  currentUserAvatar: string;
  onViewFullPost: (post: Post) => void;
  onViewMoviePage: (movieId: string) => void;
  onViewCelebrityPage: (celebrityId: string) => void;
  moviesMap: Map<string, MovieDetails>;
  celebritiesMap: Map<string, CelebrityDetails>;
}

const RelatedBuzz: React.FC<RelatedBuzzProps> = ({ posts, ...postCardProps }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">Related Buzz</h2>
      <div className="space-y-6 max-w-2xl mx-auto">
        {posts.map(post => (
          <PostCard key={post.id} post={post} {...postCardProps} />
        ))}
      </div>
    </section>
  );
};

export default RelatedBuzz;