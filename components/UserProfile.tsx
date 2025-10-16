import React, { useState } from 'react';
import { Suggestion, Post, UserProfileData } from '../types';
import PostCard from './PostCard';
import ProfileHeader from './ProfileHeader';
import FannedItems from './FannedItems';
import FavoritesSection from './FavoritesSection';
import EditProfileForm from './EditProfileForm';

interface UserProfileProps {
  user: UserProfileData;
  fannedItems: Suggestion[];
  interactedPosts: Post[];
  onToggleFan: (suggestionId: string) => void;
  onStartUnfan: (suggestionId: string, suggestionName: string) => void;
  onReaction: (postId: string, reactionId: string) => void;
  onFanzSay: (postId: string, fanzSayId: string) => void;
  onUpdateProfile: (newProfile: UserProfileData) => void;
  favoriteOptions: {
    genres: string[];
    movies: string[];
    stars: string[];
  };
  onViewFullPost: (post: Post) => void;
  onViewMoviePage: (movieId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  fannedItems,
  interactedPosts,
  onToggleFan,
  onStartUnfan,
  onReaction,
  onFanzSay,
  onUpdateProfile,
  favoriteOptions,
  onViewFullPost,
  onViewMoviePage
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (newProfile: UserProfileData) => {
    onUpdateProfile(newProfile);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto">
        <EditProfileForm 
          currentUser={user}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
          favoriteOptions={favoriteOptions}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <ProfileHeader
        name={user.name}
        avatar={user.avatar}
        fannedCount={fannedItems.length}
        postsInteractedCount={interactedPosts.length}
        onEdit={() => setIsEditing(true)}
      />

      <FavoritesSection 
        stars={user.favoriteStars}
        movies={user.favoriteMovies}
        genres={user.favoriteGenres}
      />

      <FannedItems
        fannedItems={fannedItems}
        onToggleFan={onToggleFan}
        onStartUnfan={onStartUnfan}
      />

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Your Activity</h2>
        {interactedPosts.length > 0 ? (
          <div className="space-y-6">
            {interactedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onReaction={onReaction}
                onFanzSay={onFanzSay}
                currentUserAvatar={user.avatar}
                onViewFullPost={onViewFullPost}
                onViewMoviePage={onViewMoviePage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-800 rounded-lg">
            <p className="text-slate-400">You haven't interacted with any posts yet.</p>
            <p className="text-sm text-slate-500 mt-2">React or comment on posts to see them here!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfile;