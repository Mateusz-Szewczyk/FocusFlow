import * as React from 'react';

/**
 * Two to four exclusive views on the same content — Week/Month/Year,
 * Post/Story/Wide. Never use it as a filter bar with more than four options.
 *
 * @startingPoint section="Core" subtitle="Week · Month · Year" viewport="360x80"
 */
export interface SegmentedControlProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
