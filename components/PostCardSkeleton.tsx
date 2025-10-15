import React from 'react';

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="relative rounded-xl shadow-2xl bg-slate-700 p-[2px]">
      <div className="relative bg-slate-800 rounded-[10px] overflow-hidden w-full p-5 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-slate-700"></div>
          <div className="ml-4 flex-1 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
            <div className="h-3 bg-slate-700 rounded w-1/4"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>

        {/* Image/Video Skeleton */}
        <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>

        {/* Reactions Skeleton */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-700">
          <div className="h-8 w-20 bg-slate-700 rounded-full"></div>
          <div className="h-8 w-20 bg-slate-700 rounded-full"></div>
          <div className="h-8 w-20 bg-slate-700 rounded-full"></div>
        </div>

        {/* Fanz Say Skeleton */}
        <div className="mt-4 space-y-2">
            <div className="h-6 w-1/2 bg-slate-700 rounded-md mx-auto"></div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
                <div className="h-7 w-24 bg-slate-700 rounded-full"></div>
                <div className="h-7 w-28 bg-slate-700 rounded-full"></div>
                <div className="h-7 w-20 bg-slate-700 rounded-full"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
