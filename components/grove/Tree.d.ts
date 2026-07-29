import * as React from 'react';

/**
 * One day, drawn as one tree. Height is blocks kept, leaves are things finished,
 * colour is kept over planned. Never render a dead, withered or missing tree —
 * a weak day is a small tree and a rest day is `stage={-1}`.
 *
 * @startingPoint section="Grove" subtitle="A single day as a tree" viewport="200x260"
 */
export interface TreeProps {
  /** -1 planted rest day · 0 seedling · 1–5 the Fibonacci stages 1·1·2·3·5·8. */
  stage?: -1 | 0 | 1 | 2 | 3 | 4 | 5;
  /** kept ÷ planned, banded: 0 pale · 1 · 2 · 3 fully green. */
  green?: 0 | 1 | 2 | 3;
  /** Scale multiplier. Under 0.5 the leaves are dropped as illegible. */
  size?: number;
  /** Deterministic shape seed — the same day must always draw the same tree. */
  seed?: number;
  /** Ink the tree in from the ground up on mount. */
  animate?: boolean;
  /** Continuous 3–7s canopy sway. Leave on except in exported stills. */
  sway?: boolean;
  ground?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}
export function Tree(props: TreeProps): JSX.Element;

/** Low-level: an <g> tree standing on (x, y) for composing your own landscape. */
export function treeNode(key: string, x: number, y: number, options: TreeProps & {
  opacity?: number; delay?: number;
}): JSX.Element;

/** Deterministic 0–1 generator, seeded. */
export function rng(seed: number): () => number;
export function ridgePath(key: string, y: number, w: number, dip?: number, opacity?: number): JSX.Element;
export function understoryLines(key: string, y: number, w: number, rand: () => number, n: number, opacity?: number): JSX.Element[];
