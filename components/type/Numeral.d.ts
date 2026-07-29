import * as React from 'react';

/**
 * A time or a counter. Monospace, tabular figures. `lg` is reserved for the
 * one number that answers the user's question — the minute an app reopens.
 *
 * @startingPoint section="Type" subtitle="Tabular mono times" viewport="420x140"
 */
export interface NumeralProps {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'secondary';
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Numeral(props: NumeralProps): JSX.Element;
