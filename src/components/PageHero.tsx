import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

interface PageHeroProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description: string;
  index: string;
  className?: string;
}

export function PageHero({ eyebrow, title, description, index, className = '' }: PageHeroProps) {
  return (
    <section className={`page-hero container ${className}`.trim()} data-reveal>
      <div>
        <Eyebrow showDot>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="page-hero__index">
        {index} <span>/ 04</span>
      </div>
    </section>
  );
}
