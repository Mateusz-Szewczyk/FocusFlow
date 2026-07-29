import * as React from 'react';

/**
 * Today · Grove · You. Three destinations, mono caps, no icons — the current
 * tab is marked by ink weight alone.
 *
 * @startingPoint section="Shell" subtitle="Today · Grove · You" viewport="420x80"
 */
export interface TabBarProps {
  tabs: Array<{ value: string; label: string }>;
  current: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export function TabBar(props: TabBarProps): JSX.Element;
