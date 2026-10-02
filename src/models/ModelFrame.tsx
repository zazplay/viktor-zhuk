import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import { useLang, type Text } from '../i18n';
import { cx } from '../lib/cx';
import styles from './Model.module.css';

export const PART_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export type PartKey = (typeof PART_KEYS)[number];

export type Part = {
  /** Which side of the model the label prefers. */
  side: 'l' | 'r';
  /** Inner markup of a 16×16 stroke icon. */
  icon: string;
  title: Text;
  text: Text;
};

/** The callout elements a model moves every frame to follow its part on screen. */
export type PartEls = {
  path: SVGPathElement;
  halo: SVGCircleElement;
  dot: SVGCircleElement;
  label: HTMLDivElement;
  badge: HTMLDivElement;
};

export type CalloutRefs = Partial<Record<PartKey, Partial<PartEls>>>;

/** Narrow cards swap the floating labels for numbered badges and a list under the model. */
export function useNarrow(ref: RefObject<HTMLElement | null>, below = 720) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < below));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, below]);
  return narrow;
}

const Icon = ({ markup }: { markup: string }) => (
  <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden dangerouslySetInnerHTML={{ __html: markup }} />
);

type Props = {
  eyebrow: Text;
  title: Text;
  hint?: Text;
  parts: Record<PartKey, Part>;
  layout: 'columns' | 'rows';
  height: number;
  narrowHeight: number;
  narrow: boolean;
  active: PartKey | null;
  onActive: (key: PartKey | null) => void;
  cardRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  labelsRef: RefObject<HTMLDivElement | null>;
  callouts: RefObject<CalloutRefs>;
  /** Extra blocks under the model, such as the locker's cell overview. */
  children?: ReactNode;
};

/** Heading, model card with callouts, and the part list shown on narrow screens. */
export function ModelFrame(props: Props) {
  const { parts, active, onActive, callouts, narrow } = props;
  const { t } = useLang();
  const slot = <K extends keyof PartEls>(key: PartKey, name: K) => (el: PartEls[K] | null) => {
    const refs = (callouts.current[key] ??= {});
    if (el) refs[name] = el;
    else delete refs[name];
  };
  const hover = (key: PartKey) => ({
    onPointerEnter: () => onActive(key),
    onPointerLeave: () => onActive(null),
  });

  return (
    <div className={cx(styles.wrap, styles[props.layout], narrow && styles.narrow)}>
      <div>
        <div className={styles.eyebrow}>{t(props.eyebrow)}</div>
        <h3 className={styles.title}>{t(props.title)}</h3>
      </div>
      <div ref={props.cardRef} className={styles.card} style={{ height: narrow ? props.narrowHeight : props.height }}>
        <div ref={props.stageRef} className={styles.stage} />
        <svg className={styles.overlay} aria-hidden>
          {PART_KEYS.map((key) => (
            <g key={key}>
              <path ref={slot(key, 'path')} className={cx(active === key && styles.on)} />
              <circle ref={slot(key, 'halo')} className={cx(styles.halo, active === key && styles.on)} r={11} />
              <circle ref={slot(key, 'dot')} className={styles.dot} r={active === key ? 5 : 4} />
            </g>
          ))}
        </svg>
        <div ref={props.labelsRef} className={styles.labels}>
          {PART_KEYS.map((key) => (
            <div key={key}>
              <div ref={slot(key, 'label')} data-callout className={cx(styles.label, styles[parts[key].side], active === key && styles.on)} {...hover(key)}>
                <div className={styles.labelTitle}>
                  <Icon markup={parts[key].icon} />
                  <span>{t(parts[key].title)}</span>
                  <span className={styles.key}>{key}</span>
                </div>
                <div className={styles.desc}>{t(parts[key].text)}</div>
              </div>
              <div ref={slot(key, 'badge')} data-callout className={cx(styles.badge, active === key && styles.on)} {...hover(key)}>
                {key}
              </div>
            </div>
          ))}
        </div>
        {props.hint && <div className={styles.hint}>{t(props.hint)}</div>}
      </div>
      <div className={styles.list}>
        {PART_KEYS.map((key) => (
          <div key={key} className={cx(styles.item, active === key && styles.on)} {...hover(key)}>
            <span className={styles.key}>{key}</span>
            <div className={styles.itemTitle}>
              <Icon markup={parts[key].icon} />
              <span>{t(parts[key].title)}</span>
            </div>
            <div className={styles.desc}>{t(parts[key].text)}</div>
          </div>
        ))}
      </div>
      {props.children}
    </div>
  );
}

/** Puts a part's dot and halo on its projected anchor point. */
export function placeDot(els: Partial<PartEls>, x: number, y: number) {
  for (const c of [els.dot, els.halo]) {
    c?.setAttribute('cx', String(x));
    c?.setAttribute('cy', String(y));
  }
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
