import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton = ({ className = '', count = 1 }: SkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-zinc-800/50 rounded-lg ${className}`}
        />
      ))}
    </>
  );
};

export const ServiceSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <Skeleton className="h-[300px]" count={3} />
  </div>
);

export const PostSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <Skeleton className="h-[400px]" count={3} />
  </div>
);
