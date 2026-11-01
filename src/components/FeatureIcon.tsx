export type FeatureIconName = 'portfolio' | 'services' | 'cip' | 'about';

interface FeatureIconProps {
  name: FeatureIconName;
}

export function FeatureIcon({ name }: FeatureIconProps) {
  return (
    <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === 'portfolio' && (
        <>
          <rect x="4" y="4" width="16" height="16" />
          <path d="M8 4v16M12 4v16M16 4v16M4 8h16M4 12h16M4 16h16" />
        </>
      )}
      {name === 'services' && (
        <path d="M18 8a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V5a3 3 0 1 0-3 3h12Z" />
      )}
      {name === 'cip' && (
        <>
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
        </>
      )}
      {name === 'about' && (
        <>
          <circle cx="12" cy="12" r="7.5" />
          <circle cx="12" cy="12" r="3.5" />
        </>
      )}
    </svg>
  );
}
