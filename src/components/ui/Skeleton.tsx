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
          'linear-gradient(90deg,rgba(167,176,194,0.10) 25%,rgba(167,176,194,0.18) 50%,rgba(167,176,194,0.10) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  );
}
