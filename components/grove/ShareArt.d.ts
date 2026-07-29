import * as React from 'react';

/**
 * The exportable month/year image. Everything — headline, totals and wordmark —
 * is drawn into the artwork so the file stands alone.
 *
 * @startingPoint section="Grove" subtitle="Shareable forest, 3 crops" viewport="360x440"
 */
export interface ShareArtProps {
  format?: 'post' | 'story' | 'wide';
  title?: string;
  subtitle?: string;
  /** Mono caps line of totals. Trees, days and totals only. */
  totals?: string;
  wordmark?: string;
  style?: React.CSSProperties;
}
export function ShareArt(props: ShareArtProps): JSX.Element;
