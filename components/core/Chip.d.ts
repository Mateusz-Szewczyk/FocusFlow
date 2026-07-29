import * as React from 'react';

/**
 * A mono-caps pill. Selected inverts to solid ink.
 *
 * @startingPoint section="Core" subtitle="Mono-caps selection pill" viewport="360x80"
 */
export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children?: React.ReactNode;
}
export function Chip(props: ChipProps): JSX.Element;
