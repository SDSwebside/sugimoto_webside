import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  showDot?: boolean;
  className?: string;
}

export function Eyebrow({ children, showDot = false, className = '' }: EyebrowProps) {
  return (
    <span className={`eyebrow ${className}`.trim()}>
      {showDot && <span className="eyebrow__dot" />}
      {children}
    </span>
  );
}
