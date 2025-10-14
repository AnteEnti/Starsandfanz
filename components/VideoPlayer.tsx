import React, { useState, useEffect, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  duration: number;
}

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);
  
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setPlaybackTime(prevTime => {
          if (prevTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prevTime + 0.1;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setPlaybackTime(newTime);
  };

  const progressPercent = (playbackTime / duration) * 100;

  return (
    <div className="relative aspect-video bg-black group">
      <iframe
        className="w-full h-full pointer-events-none"
        src={`${videoUrl}&start=${Math.floor(playbackTime)}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Seek Bar */}
        <div className="relative h-1.5 bg-white/20 rounded-full cursor-pointer -mx-1 mb-2">
            <div className="absolute h-full bg-purple-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            <input
                type="range"
                min="0"
                max={duration}
                value={playbackTime}
                onChange={handleSeek}
                className="absolute w-full h-full opacity-0 cursor-pointer"
            />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white">
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M6.25 5.25h2.5v13.5h-2.5zM15.25 5.25h2.5v13.5h-2.5z"></path></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M8.25 4.5l12 7.5-12 7.5z"></path></svg>
                )}
            </button>
            <span className="text-white font-mono text-sm">{formatTime(playbackTime)} / {formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;