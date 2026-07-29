import * as React from 'react';

/**
 * A key/value line. Use for facts that explain the grove or the plan —
 * never to build a dashboard. If a number does not change what you do next, cut it.
 *
 * @startingPoint section="Data" subtitle="Key and value on a hairline" viewport="420x180"
 */
export interface StatRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Drop the underline on the final row of a group. */
  last?: boolean;
  style?: React.CSSProperties;
}
export function StatRow(props: StatRowProps): JSX.Element;
