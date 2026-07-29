import * as React from 'react';

/**
 * A dotted sentence. Amber marks something that needs the user's care
 * (a plan conflict, a limit) — never decoration, never an error shout.
 *
 * @startingPoint section="Data" subtitle="Jade and amber bullets" viewport="420x140"
 */
export interface BulletItemProps {
  tone?: 'accent' | 'caution';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function BulletItem(props: BulletItemProps): JSX.Element;
