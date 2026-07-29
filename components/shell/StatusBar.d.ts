import * as React from 'react';

/**
 * The drawn status bar at the top of every screen. Line art, tertiary weight —
 * it must never compete with the headline.
 *
 * @startingPoint section="Shell" subtitle="Drawn iOS status bar" viewport="420x60"
 */
export interface StatusBarProps { time?: string; style?: React.CSSProperties }
export function StatusBar(props: StatusBarProps): JSX.Element;
