import type { LucideIcon } from 'lucide-react';
import type { Text } from './i18n';

/** A simple-icons style brand mark: a single path on a 24×24 viewBox. */
export type Brand = { title: string; path: string };

export type Stat = { value: Text; label: Text; accent?: boolean };

/** Tech tag under a work item; plain copy renders without an icon. */
export type TechTag = Text | { label: Text; brand?: Brand };

export type WorkItem = {
  icon: LucideIcon;
  title: Text;
  text: Text;
  tags?: TechTag[];
  /** Grey size summary appended after the tags. */
  meta?: Text;
  /** Someone else's part of the system: shown with a dash instead of a number. */
  external?: boolean;
};

export type Overview = {
  period: Text;
  title: Text;
  badge: Text;
  summary: Text;
  stats: Stat[];
  work: WorkItem[];
  footnote?: Text;
};

export type Proof = { icon: LucideIcon; title: Text; text: Text };

/** Stack chip; plain copy renders as a chip without a link. */
export type StackItem = Text | { label: Text; href?: string; brand?: Brand };

export type StackGroup = { title: Text; items: StackItem[] };

export type FlowNodeData = { icon: LucideIcon; title: Text; caption: Text };
