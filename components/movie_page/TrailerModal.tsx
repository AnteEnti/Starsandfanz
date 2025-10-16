import React, { useState, useEffect } from 'react';

interface TrailerModalProps {
  trailerUrl: string;
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ trailerUrl, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = 'unset';
    };
  }, []);
  
  // Ensure autoplay by modifying the URL
  const autoPlayUrl = `${trailerUrl.split('?')[0]}?autoplay=1&mute=0&controls=1`;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'animate-modal-bg-exit' : 'animate-modal-bg-enter'}`}
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
        <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/50 hover:bg-slate-800 transition-colors" 
            aria-label="Close trailer"
        >
            <span className="material-symbols-outlined text-white">close</span>
        </button>

      <div
        className={`w-full max-w-4xl aspect-video shadow-2xl relative rounded-lg overflow-hidden ${isClosing ? 'animate-modal-content-exit' : 'animate-modal-content-enter'}`}
        onClick={e => e.stopPropagation()}
      >
        <iframe
          className="w-full h-full"
          src={autoPlayUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerModal;
