import React, { useMemo } from 'react';

// Mock data representing new users per day for the last 30 days
const generateMockData = () => {
    const data = [];
    let cumulativeUsers = 18500; // Start from a base
    for (let i = 30; i > 0; i--) {
        const newUsers = 50 + Math.floor(Math.random() * 100);
        cumulativeUsers += newUsers;
        data.push({ day: i, users: cumulativeUsers });
    }
    return data.reverse();
};


const UserGrowthChart: React.FC = () => {
  const data = useMemo(() => generateMockData(), []);
  const maxUsers = Math.max(...data.map(d => d.users));
  const minUsers = Math.min(...data.map(d => d.users));

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.users - minUsers) / (maxUsers - minUsers)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-slate-700/50 p-5 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-1">User Growth</h3>
      <p className="text-sm text-slate-400 mb-4">Last 30 Days</p>
      <div className="h-48 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polyline
            fill="url(#growthGradient)"
            stroke="#a78bfa"
            strokeWidth="0.5"
            points={`0,100 ${points} 100,100`}
          />
        </svg>
        <div className="absolute top-0 left-0 text-xs text-slate-400">{Math.round(maxUsers / 1000)}k</div>
        <div className="absolute bottom-0 left-0 text-xs text-slate-400">{Math.round(minUsers / 1000)}k</div>
        <div className="absolute bottom-0 right-0 text-xs text-slate-400">Today</div>
      </div>
    </div>
  );
};

export default UserGrowthChart;