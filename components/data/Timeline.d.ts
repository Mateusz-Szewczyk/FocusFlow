import * as React from 'react';

/**
 * The rest of today, or a proposed fortnight, as a thread of blocks.
 * Past blocks fade to tertiary ink; the running one is the single jade dot.
 *
 * @startingPoint section="Data" subtitle="The day as a thread of blocks" viewport="420x260"
 */
export interface TimelineItem {
  time: string;
  name: React.ReactNode;
  state?: 'done' | 'now' | 'todo';
}
export interface TimelineProps { items: TimelineItem[]; style?: React.CSSProperties }
export function Timeline(props: TimelineProps): JSX.Element;
