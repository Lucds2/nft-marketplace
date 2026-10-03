import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/60 bg-linear-to-r from-muted via-muted-foreground/15 to-muted bg-size[200%_100%] ${className}`}
      {...props}
    />
  );
}