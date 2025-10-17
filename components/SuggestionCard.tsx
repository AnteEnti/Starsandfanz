import React, { useState, useEffect, useRef } from 'react';
import { Suggestion } from '../types';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onToggleFan: (suggestionId: string) => void;
  onStartUnfan: (suggestionId: string, suggestionName: string) => void;
  disappearsOnFan?: boolean;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onToggleFan, onStartUnfan, disappearsOnFan = false }) => {
  const { id, name, avatar, type, isFanned } = suggestion;
  const [feedback, setFeedback] = useState<{ type: 'fan' | 'unfan'; key: number } | null>(null);
  const prevIsFannedRef = useRef(isFanned);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // This effect handles the feedback when the card does NOT disappear (e.g., in profile)
    if (prevIsFannedRef.current !== isFanned && !disappearsOnFan) {
      const feedbackType = isFanned ? 'fan' : 'unfan';
      setFeedback({ type: feedbackType, key: Date.now() });

      const timer = setTimeout(() => {
        setFeedback(null);
      }, 1500);

      prevIsFannedRef.current = isFanned;
      
      return () => clearTimeout(timer);
    }
  }, [isFanned, disappearsOnFan]);

  const handleFanAndDisappear = () => {
    if (isExiting) return; // Prevent double-clicks
    
    // Manually trigger feedback animation
    setFeedback({ type: 'fan', key: Date.now() });
    
    // Start exit animation on the card itself
    setIsExiting(true);

    // After the exit animation completes, call the parent handler to update global state
    setTimeout(() => {
      onToggleFan(id);
    }, 1500); // This should match the CSS animation duration
  };

  const exitAnimationClass = isExiting ? 'animate-slide-and-fade-out' : '';

  const feedbackElement = feedback && (
    <div 
      key={feedback.key} 
      className="absolute inset-0 bg-slate-900/80 rounded-lg flex flex-col items-center justify-center z-20 animate-fade-out"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={`text-4xl ${feedback.type === 'fan' ? 'animate-pop-in' : ''}`}>
        {feedback.type === 'fan' ? '⭐' : '👋'}
      </span>
      <p className="text-white font-bold mt-2">
        {feedback.type === 'fan' ? 'Fanned!' : 'Un-fanned'}
      </p>
    </div>
  );

  if (isFanned) {
    const isFannedStyle = "relative flex-shrink-0 w-40 bg-slate-800 rounded-lg shadow-lg p-3 text-center transition-all duration-300 border-2 border-purple-500 shadow-purple-500/20";
    return (
      <div className={`${isFannedStyle} ${exitAnimationClass}`}>
        {feedbackElement}

        <button
          onClick={() => onStartUnfan(id, name)}
          className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors duration-200 z-10 p-1 bg-slate-700/50 rounded-full"
          aria-label={`Un-fan ${name}`}
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto border-2 border-slate-600 object-cover" />
        <h3 className="text-md font-bold text-white mt-3 truncate">{name}</h3>
        <p className="text-xs text-slate-400 mb-3">{type}</p>
        
        <div className="w-full flex items-center justify-center space-x-1.5 font-semibold py-2 px-4 text-yellow-400 h-[40px]">
            <span>⭐</span>
            <span>Fanz</span>
        </div>
      </div>
    );
  }

  const fanButtonStyle = "w-full flex items-center justify-center space-x-2 font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500";

  return (
    <div className={`relative flex-shrink-0 w-40 rounded-[10px] bg-gradient-to-r from-orange-400 via-fuchsia-500 to-indigo-500 p-[2px] animate-gradient-border transition-transform duration-300 transform hover:-translate-y-1 ${exitAnimationClass}`}>
      <div className="relative bg-slate-800 rounded-lg shadow-lg p-3 text-center h-full">
        {feedbackElement}
        
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto border-2 border-slate-600 object-cover" />
        <h3 className="text-md font-bold text-white mt-3 truncate">{name}</h3>
        <p className="text-xs text-slate-400 mb-3">{type}</p>
        
        <button
          onClick={disappearsOnFan ? handleFanAndDisappear : () => onToggleFan(id)}
          className={fanButtonStyle}
          aria-pressed={isFanned}
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>Fan</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(SuggestionCard);