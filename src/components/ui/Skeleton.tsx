/**
 * Skeleton loading placeholder with shimmer animation.
 * Matches the dark-theme shimmer used across dashboard components.
 */
interface SkeletonProps {
  className: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background:
          'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  );
}