import * as React from 'react';

/**
 * Mono-caps micro label — "NEXT · 18:00", "UNTIL 18:50", "YOUR NOTE, 17:58".
 * The only uppercase in the system.
 *
 * @startingPoint section="Type" subtitle="Mono-caps micro label" viewport="420x120"
 */
export interface LabelProps {
  size?: 'xs' | 'sm' | 'lg';
  tone?: 'primary' | 'secondary' | 'tertiary';
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Label(props: LabelProps): JSX.Element;
