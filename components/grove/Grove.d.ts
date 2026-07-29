import * as React from 'react';

/**
 * A stand of days. Week is a readable row of seven; month is five receding rows
 * with the newest week in front; year is twelve stands on one horizon.
 *
 * @startingPoint section="Grove" subtitle="Week, month and year landscapes" viewport="360x240"
 */
export interface GroveProps {
  view?: 'week' | 'month' | 'year';
  /** Only used by `view="week"`: seven days, oldest first. */
  days?: Array<{ d: string; stage: number; green: number }>;
  /** Ink the stand in from the back row forward on mount. */
  animate?: boolean;
  /** Paint the sky behind. Off for artwork placed on a screen background. */
  background?: boolean;
  style?: React.CSSProperties;
}
export function Grove(props: GroveProps): JSX.Element;
