import React, { useMemo } from 'react';
import { Post } from '../../../types';
import UserGrowthChart from './UserGrowthChart';
import PopularPosts from './PopularPosts';
import RecentActivities from './RecentActivities';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-slate-700/50 p-5 rounded-lg flex items-center gap-5">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

interface DashboardViewProps {
  posts: Post[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ posts }) => {
  const totalReactions = useMemo(() =>
    posts.reduce((acc, post) => {
      const postReactionTotal = post.reactions?.reduce((sum, reaction) => sum + reaction.count, 0) || 0;
      return acc + postReactionTotal;
    }, 0),
  [posts]);

  const totalFanzSays = useMemo(() => 
    posts.reduce((acc, post) => {
      return acc + (post.fanzSays?.reduce((sum, fs) => sum + fs.fans.length, 0) || 0);
    }, 0), 
  [posts]);

  return (
    <div className="p-6 space-y-6">
       <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Posts" value={posts.length.toLocaleString()} icon="article" color="bg-sky-500" />
        <StatCard title="Total Reactions" value={totalReactions.toLocaleString()} icon="favorite" color="bg-rose-500" />
        <StatCard title="Total Fanz Clicks" value={totalFanzSays.toLocaleString()} icon="thumb_up" color="bg-amber-500" />
        <StatCard title="Users" value="21.4K" icon="group" color="bg-teal-500" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
           <UserGrowthChart />
           <RecentActivities />
        </div>
        <div className="lg:col-span-1">
           <PopularPosts posts={posts} />
        </div>
      </div>
    </div>
  );
};

// FIX: Corrected typo in export statement from 'employability' to 'DashboardView'.
export default DashboardView;