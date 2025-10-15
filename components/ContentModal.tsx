import React from 'react';
import { Post } from '../types';

interface ContentModalProps {
  post: Post;
  onClose: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ post, onClose }) => {
  // Determine the primary image URL to display from various post types
  const imageUrl = post.imageUrl 
    || post.countdownDetails?.imageUrl 
    || post.projectAnnouncementDetails?.posterUrl 
    || post.movieDetails?.posterUrl 
    || post.characterDetails?.imageUrl 
    || post.celebrityDetails?.imageUrl;

  // This modal is primarily for images, so if there's no image, we don't render.
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors z-10"
        aria-label="Close"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      <div
        className="relative max-w-4xl w-[95vw] max-h-[90vh] p-4 animate-zoom-in"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking on the content
      >
        <img
          src={imageUrl}
          alt="Full screen content"
          className="w-auto h-auto mx-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default ContentModal;