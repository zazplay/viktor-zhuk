import type { ReactNode } from 'react';
import { keyOf, useLang, type Text } from '../i18n';
import type { FlowNodeData } from '../types';
import { cx } from '../lib/cx';
import styles from './Flow.module.css';

/** Horizontal centre of column `i` in an `n`-column grid with the given CSS gap. */
function columnCenter(i: number, n: number, gap: string): string {
  return `calc((100% - ${n - 1} * ${gap}) * ${2 * i + 1} / ${2 * n} + ${i} * ${gap})`;
}

function Dot({ duration }: { duration: number }) {
  return <span className={styles.dot} style={{ animationDuration: `${duration}s` }} />;
}

type VerticalProps = { x: string; top: number; height: number; duration?: number };

function Vertical({ x, top, height, duration }: VerticalProps) {
  return (
    <div className={styles.vertical} style={{ left: x, top, height }}>
      {duration !== undefined && <Dot duration={duration} />}
    </div>
  );
}

type FanProps = {
  /** Number of columns in the adjacent node row. */
  columns: number;
  /** Column gap of that row, any CSS length. */
  gap: string;
  /** Length of the per-column segments, px. */
  branch: number;
  /** Length of the single centre segment, px. */
  trunk: number;
  /** Dot travel time per column segment, seconds. */
  durations: number[];
  trunkDuration: number;
  className?: string;
};

/** Dashed connectors: every column above drops into one trunk below. */
export function FlowMerge({ columns, gap, branch, trunk, durations, trunkDuration, className }: FanProps) {
  const xs = Array.from({ length: columns }, (_, i) => columnCenter(i, columns, gap));
  return (
    <div className={cx(styles.fan, className)} style={{ height: branch + trunk }} aria-hidden="true">
      {xs.map((x, i) => (
        <Vertical key={i} x={x} top={0} height={branch} duration={durations[i % durations.length]} />
      ))}
      <div className={styles.horizontal} style={{ top: branch, left: xs[0], right: xs[0] }} />
      <Vertical x="50%" top={branch} height={trunk} duration={trunkDuration} />
    </div>
  );
}

/** Dashed connectors: one trunk above fans out to every column below. */
export function FlowSplit({ columns, gap, branch, trunk, durations, trunkDuration, className }: FanProps) {
  const xs = Array.from({ length: columns }, (_, i) => columnCenter(i, columns, gap));
  return (
    <div className={cx(styles.fan, className)} style={{ height: trunk + branch }} aria-hidden="true">
      <Vertical x="50%" top={0} height={trunk} duration={trunkDuration} />
      <div className={styles.horizontal} style={{ top: trunk, left: xs[0], right: xs[0] }} />
      {xs.map((x, i) => (
        <Vertical key={i} x={x} top={trunk} height={branch} duration={durations[i % durations.length]} />
      ))}
    </div>
  );
}

/** A single centred vertical connector. */
export function FlowLine({ height, duration }: { height: number; duration: number }) {
  return (
    <div className={styles.line} style={{ height }} aria-hidden="true">
      <Dot duration={duration} />
    </div>
  );
}

type FlowNodeProps = FlowNodeData & { hub?: boolean };

export function FlowNode({ icon: Icon, title, caption, hub }: FlowNodeProps) {
  const { t } = useLang();
  return (
    <div className={cx(styles.node, hub && styles.hub)}>
      <div className={styles.nodeTitle}>
        <Icon size={14} className={styles.nodeIcon} aria-hidden />
        {t(title)}
      </div>
      <div className={styles.nodeCaption}>{t(caption)}</div>
    </div>
  );
}

const NODE_GAP = '16px';

function NodeRow({ nodes }: { nodes: FlowNodeData[] }) {
  return (
    <div className={styles.row} style={{ gridTemplateColumns: `repeat(${nodes.length}, minmax(0, 1fr))`, gap: NODE_GAP }}>
      {nodes.map((node) => (
        <FlowNode key={keyOf(node.title)} {...node} />
      ))}
    </div>
  );
}

type HubDiagramProps = {
  inputs: FlowNodeData[];
  hub: ReactNode;
  caption: Text;
  outputs: FlowNodeData[];
};

/** Inputs converge on a hub, which then fans out to outputs. */
export function HubDiagram({ inputs, hub, caption, outputs }: HubDiagramProps) {
  const { t } = useLang();
  return (
    <div className={styles.diagram}>
      <NodeRow nodes={inputs} />
      <FlowMerge columns={inputs.length} gap={NODE_GAP} branch={24} trunk={22} durations={[2.5, 3]} trunkDuration={2.7} />
      {hub}
      <p className={styles.caption}>{t(caption)}</p>
      <FlowSplit
        columns={outputs.length}
        gap={NODE_GAP}
        trunk={22}
        branch={30}
        durations={[2.3, 2.9, 2.1]}
        trunkDuration={2.6}
        className={styles.split}
      />
      <NodeRow nodes={outputs} />
    </div>
  );
}
