import * as React from 'react';

/**
 * The action set. Exactly one `primary` per screen; `quiet` for the second
 * choice; `tiny` for the way out; `inline` for a link inside prose.
 *
 * @startingPoint section="Core" subtitle="Primary, quiet, tiny and inline" viewport="360x260"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'quiet' | 'tiny' | 'inline';
  children?: React.ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;
