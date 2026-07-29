import * as React from 'react';

/**
 * iPhone bezel for prototypes and marketing stills. Its child screen inherits
 * the theme scope, so a night session can run dark inside a light page.
 *
 * @startingPoint section="Shell" subtitle="Device bezel, light or dark" viewport="420x820"
 */
export interface PhoneFrameProps {
  theme?: 'light' | 'dark';
  width?: number;
  height?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function PhoneFrame(props: PhoneFrameProps): JSX.Element;
