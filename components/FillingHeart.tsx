import React from 'react';

interface FillingHeartProps {
  fillLevel: number;
}

const FillingHeart: React.FC<FillingHeartProps> = ({ fillLevel }) => {
  const level = Math.max(0, Math.min(fillLevel, 3)); // Clamp between 0 and 3
  const isFull = level >= 3;

  return (
    <div className="heart-wrap">
      <div className={`heart fill-level-${level} ${isFull ? 'is-full' : ''}`}>
        <div className="tank"></div>
        <svg className="curve" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave-heart" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g>
            {/* Semi-transparent red waves layered on top of the solid .tank fill */}
            <use xlinkHref="#gentle-wave-heart" x="48" y="0" fill="rgba(244, 63, 94, 0.2)" />
            <use xlinkHref="#gentle-wave-heart" x="48" y="3" fill="rgba(244, 63, 94, 0.4)" />
            <use xlinkHref="#gentle-wave-heart" x="48" y="5" fill="rgba(244, 63, 94, 0.6)" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default FillingHeart;