
import React, { useState } from 'react';
import { Post } from '../../types';
import TrailerModal from './TrailerModal';

interface RelatedVideosProps {
  videos: Post[];
}

const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:embed\/|watch\?v=)?(.+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1].split('&')[0];
  }
  return null;
};

const RelatedVideos: React.FC<RelatedVideosProps> = ({ videos }) => {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">Related Videos</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {videos.map(video => {
            if (!video.videoUrl) return null;
            const videoId = getYouTubeVideoId(video.videoUrl);
            if (!videoId) return null;
            
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
              <div key={video.id} className="flex-shrink-0 w-64 text-left group">
                <button
                  onClick={() => setSelectedVideoUrl(video.videoUrl!)}
                  className="w-full h-36 relative rounded-lg overflow-hidden border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label={`Play video: ${video.content}`}
                >
                  <img 
                    src={thumbnailUrl} 
                    alt={video.content}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="material-symbols-outlined text-5xl text-white">play_circle</span>
                  </div>
                </button>
                <div className="p-1 mt-1">
                  <p className="text-sm text-slate-300 mt-1 line-clamp-2">{video.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedVideoUrl && (
        <TrailerModal 
          trailerUrl={selectedVideoUrl}
          onClose={() => setSelectedVideoUrl(null)} 
        />
      )}
    </>
  );
};

export default RelatedVideos;