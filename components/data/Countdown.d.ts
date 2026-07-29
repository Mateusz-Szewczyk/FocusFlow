import * as React from 'react';

/**
 * Time until the next block, as words plus a hairline that quietly drains.
 * No percentage, no ring, no colour change as it runs out.
 *
 * @startingPoint section="Data" subtitle="Wait, drawn as a draining hairline" viewport="420x100"
 */
export interface CountdownProps {
  text?: string;
  /** Length of the wait, used only to pace the drain. */
  seconds?: number;
  width?: number;
  style?: React.CSSProperties;
}
export function Countdown(props: CountdownProps): JSX.Element;
