import * as React from 'react';

/**
 * Body copy. Calm, adult, never shaming — after a broken day it says
 * "tomorrow you can start with a shorter block".
 *
 * @startingPoint section="Type" subtitle="Body copy at 1.8 leading" viewport="420x140"
 */
export interface NoteProps {
  size?: 'sm' | 'md' | 'lg';
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Note(props: NoteProps): JSX.Element;
