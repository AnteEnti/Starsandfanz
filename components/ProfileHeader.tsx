import React from 'react';

interface ProfileHeaderProps {
  name: string;
  avatar: string;
  fannedCount: number;
  postsInteractedCount: number;
  onEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, avatar, fannedCount, postsInteractedCount, onEdit }) => {
  return (
    <section className="relative bg-slate-800 rounded-lg p-6 text-center shadow-xl">
       <button 
        onClick={onEdit}
        className="absolute top-3 right-3 flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs py-1.5 px-3 rounded-full transition-colors duration-200"
        aria-label="Edit profile"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
        <span>Edit Profile</span>
      </button>

      <img
        src={avatar}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto border-4 border-purple-500 shadow-lg object-cover"
      />
      <h1 className="text-3xl font-bold text-white mt-4">{name}</h1>
      <div className="mt-4 flex justify-center space-x-6 text-slate-300">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-400">{fannedCount}</p>
          <p className="text-sm uppercase tracking-wider">Fanned</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-400">{postsInteractedCount}</p>
          <p className="text-sm uppercase tracking-wider">Interactions</p>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;