import React from 'react';

interface HypeMeterProps {
  hypeLevel: number;
  maxHypeLevel: number;
  isCelebrationModeActive: boolean;
}

const HypeMeter: React.FC<HypeMeterProps> = ({ hypeLevel, maxHypeLevel, isCelebrationModeActive }) => {
  const percentage = (hypeLevel / maxHypeLevel) * 100;
  
  return (
    <div className="w-full max-w-xs" title={`Hype Level: ${hypeLevel}/${maxHypeLevel}`}>
        <div className="flex justify-between items-center mb-1 text-xs font-bold">
            <span className="text-purple-300">Hype Meter</span>
            <span className={isCelebrationModeActive ? 'text-yellow-300 animate-pulse' : 'text-slate-400'}>
                {isCelebrationModeActive ? 'CELEBRATING!' : `${Math.floor(percentage)}%`}
            </span>
        </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HypeMeter;
