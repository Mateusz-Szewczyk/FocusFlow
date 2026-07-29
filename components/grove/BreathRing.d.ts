import * as React from 'react';

/**
 * The running-session marker: a ring breathing on a 15s sine, with a stem
 * quietly growing inside it over the length of the block.
 *
 * @startingPoint section="Grove" subtitle="Focus session breathing ring" viewport="240x240"
 */
export interface BreathRingProps {
  size?: number;
  /** Length of one full breath. 15s is the product default; do not speed it up. */
  seconds?: number;
  /** The growing stem inside the ring. */
  stem?: boolean;
  style?: React.CSSProperties;
}
export function BreathRing(props: BreathRingProps): JSX.Element;
