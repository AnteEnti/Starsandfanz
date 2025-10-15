import React, { useMemo } from 'react';
import { Post, ReactionType } from '../../types';

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

const ActivityChart: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const data = useMemo(() => {
    // This is a simplified chart; in a real app, you'd parse timestamps.
    // Here we'll just create some fake data based on post index.
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, index) => ({
      name: day,
      posts: posts.filter((_, i) => i % 7 === index).length + Math.floor(Math.random() * 3),
    }));
  }, [posts]);

  const maxPosts = Math.max(...data.map(d => d.posts), 1);

  return (
    <div className="bg-slate-700/50 p-5 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="flex justify-between items-end h-40 gap-2">
        {data.map(day => (
          <div key={day.name} className="flex-1 flex flex-col items-center justify-end gap-2">
            <div 
              className="w-full bg-purple-500 rounded-t-md transition-all duration-500"
              style={{ height: `${(day.posts / maxPosts) * 100}%` }}
              title={`${day.posts} posts`}
            ></div>
            <p className="text-xs text-slate-400">{day.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DashboardViewProps {
  posts: Post[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ posts }) => {
  const totalReactions = useMemo(() => 
    posts.reduce((acc, post) => {
      // Fix for: Operator '+' cannot be applied to types 'unknown' and 'number'.
      // The `count` from `Object.values` can be of type `unknown`, so we need to safely cast it to a number.
      const postReactionTotal = Object.values(post.reactions).reduce(
        (sum, count) => sum + (Number(count) || 0),
        0
      );
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart posts={posts} />
        </div>
        <div className="bg-slate-700/50 p-5 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <div className="space-y-2">
            <a href="#" className="block text-purple-400 hover:text-purple-300">View Site Analytics</a>
            <a href="#" className="block text-purple-400 hover:text-purple-300">Manage Comments</a>
            <a href="#" className="block text-purple-400 hover:text-purple-300">Export User Data</a>
            <a href="#" className="block text-purple-400 hover:text-purple-300">View API Status</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
