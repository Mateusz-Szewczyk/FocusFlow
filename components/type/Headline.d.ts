import * as React from 'react';

/**
 * The bookish serif voice of the product. Headlines are short sentences and
 * they end in a full stop: "Today branched.", "The day is planted."
 *
 * @startingPoint section="Type" subtitle="Serif display sizes" viewport="420x260"
 */
export interface HeadlineProps {
  /** xl 42 marketing · l 32 screen · m 24 section · s 19 pull quote */
  size?: 'xl' | 'l' | 'm' | 's';
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Headline(props: HeadlineProps): JSX.Element;
