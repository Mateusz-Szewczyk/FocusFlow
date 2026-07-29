import * as React from 'react';

/**
 * A hairline rule. FocusFlow separates with hairlines and whitespace — never
 * with a card, a fill or a shadow.
 *
 * @startingPoint section="Core" subtitle="Hairline divider" viewport="360x60"
 */
export interface RuleProps { gap?: number; style?: React.CSSProperties }
export function Rule(props: RuleProps): JSX.Element;
