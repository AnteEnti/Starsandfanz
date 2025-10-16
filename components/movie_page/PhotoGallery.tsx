import React from 'react';

interface PhotoGalleryProps {
  imageUrls: string[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ imageUrls }) => {
  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in-up" style={{animationDelay: '150ms'}}>
      <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">Gallery</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {imageUrls.map((url, index) => (
          <div key={index} className="flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden group">
            <img 
              src={url} 
              alt={`Gallery image ${index + 1}`} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGallery;