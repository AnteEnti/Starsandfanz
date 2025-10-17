import React, { useState, useEffect, useRef } from 'react';
import { BannerContent } from '../App';

declare const confetti: any;

interface WelcomeBannerProps {
  onDismiss: () => void;
  content: BannerContent;
}

const AnimatedEmoji: React.FC<{ emoji: string; top: string; left: string; size: string; duration: string; delay: string; }> = 
({ emoji, top, left, size, duration, delay }) => {
  return (
    <span
      className={`absolute animate-emoji-pop-float ${size}`}
      style={{
        top,
        left,
        animationDuration: duration,
        animationDelay: delay,
      }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
};

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onDismiss, content }) => {
  const [introStep, setIntroStep] = useState<'idle' | 'start' | 'confetti' | 'slogan-animated'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstance = useRef<any>(null);
  const [clickedEmoji, setClickedEmoji] = useState<'confetti' | 'whistle' | null>(null);

  useEffect(() => {
    // Initialize confetti instance
    if (canvasRef.current && !confettiInstance.current) {
      confettiInstance.current = confetti.create(canvasRef.current, { useWorker: true, resize: true });
    }

    // --- Introductory Animation Sequence ---
    const startTimer = setTimeout(() => setIntroStep('start'), 500);

    const confettiTriggerTimer = setTimeout(() => {
        setIntroStep('confetti');
        if (confettiInstance.current) {
             confettiInstance.current({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.8 },
                colors: ['#facc15', '#f97316', '#ffffff', '#a855f7']
            });
        }
    }, 1500);

    const sloganAnimationTimer = setTimeout(() => setIntroStep('slogan-animated'), 2500);

    return () => {
        clearTimeout(startTimer);
        clearTimeout(confettiTriggerTimer);
        clearTimeout(sloganAnimationTimer);
    };
  }, []);

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const handleEmojiClick = (type: 'confetti' | 'whistle') => {
    setClickedEmoji(type);
    setTimeout(() => setClickedEmoji(null), 600);

    if (type === 'whistle') {
        // Handle whistle animation if any, but it's mainly a visual pop now
        return;
    }

    if (type === 'confetti' && confettiInstance.current) {
        // "Random direction" logic from user's example
        confettiInstance.current({
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            particleCount: randomInRange(50, 100),
            origin: { y: 0.7 }, // Keeping origin consistent with button location
            colors: ['#facc15', '#f97316', '#ffffff', '#a855f7']
        });
    }
  };


  const descriptionParts = content.description.split('starsandfanz.com');
  const descriptionBefore = descriptionParts[0];
  const descriptionAfter = descriptionParts.length > 1 ? descriptionParts[1] : '';

  const showSloganAnimation = introStep === 'slogan-animated';
  const showButtons = introStep === 'slogan-animated';

  return (
    <div className="relative w-full h-96 sm:h-80 overflow-hidden bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />

      {/* Floating Emojis */}
      <AnimatedEmoji emoji="🎉" top="10%" left="15%" size="text-3xl md:text-5xl" duration="4s" delay="0s" />
      <AnimatedEmoji emoji="🥳" top="20%" left="85%" size="text-4xl md:text-6xl" duration="3.5s" delay="0.5s" />
      <AnimatedEmoji emoji="🎉" top="70%" left="5%" size="text-3xl md:text-4xl" duration="5s" delay="1s" />
      <AnimatedEmoji emoji="🥳" top="65%" left="90%" size="text-4xl md:text-5xl" duration="4.5s" delay="0.2s" />
      
      {/* Text Content */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {content.headline1}
        </h2>
        <h1 
            className={`text-4xl sm:text-5xl md:text-6xl font-black transition-colors duration-500 ${showSloganAnimation ? 'animate-glitter text-yellow-300' : 'text-white'}`}
            style={{ textShadow: '0 3px 6px rgba(0,0,0,0.2)' }}
        >
          {content.headline2}
        </h1>
        <div className="mt-4 text-sm font-medium text-slate-800 max-w-xs sm:max-w-lg">
          <p className="whitespace-pre-wrap">
            <span>{descriptionBefore}</span>
            <span className="font-bold animate-text-glow">starsandfanz.com</span>
            <span>{descriptionAfter}</span>
          </p>
        </div>
      </div>

       {/* Interactive Emoji Buttons */}
      <div className={`absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 transition-opacity duration-500 z-30 ${showButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={() => handleEmojiClick('confetti')} 
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900/20 backdrop-blur-sm flex items-center justify-center text-4xl sm:text-5xl transform transition-transform hover:scale-110 active:scale-95 shadow-lg ${clickedEmoji === 'confetti' ? 'animate-emoji-click' : ''}`}
          aria-label="Celebrate"
        >
          🎉
        </button>
        <button 
          onClick={() => handleEmojiClick('whistle')} 
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900/20 backdrop-blur-sm flex items-center justify-center text-4xl sm:text-5xl transform transition-transform hover:scale-110 active:scale-95 shadow-lg ${clickedEmoji === 'whistle' ? 'animate-emoji-click' : ''}`}
          aria-label="Whistle"
        >
          🥳
        </button>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-slate-800/70 hover:text-slate-900 transition-colors duration-200 p-2 bg-white/30 hover:bg-white/50 rounded-full z-30"
        aria-label="Dismiss welcome message"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      <style>{`
        @keyframes emoji-click {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .animate-emoji-click {
          animation: emoji-click 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
};

export default WelcomeBanner;
