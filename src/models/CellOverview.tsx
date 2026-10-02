import { useEffect, useState, type CSSProperties } from 'react';
import { l, useLang } from '../i18n';
import { cx } from '../lib/cx';
import styles from './CellOverview.module.css';
import { CELLS, FILTERS, matchesFilter, OPEN_CELL, STATES, type CellState, type Filter } from './lockerCells';

const CELL_ICON: Record<'box' | 'truck' | 'tri' | 'off', string> = {
  box: '<path d="M2.5 5 8 2l5.5 3v6L8 14l-5.5-3z"/><path d="M2.5 5 8 8l5.5-3M8 8v6"/>',
  truck: '<path d="M1.5 4h8v7h-8zM9.5 6.5h3l2 2.5V11h-5"/><circle cx="4.5" cy="12" r="1.3"/><circle cx="11.5" cy="12" r="1.3"/>',
  tri: '<path d="M8 2 14.5 13.5h-13z"/><path d="M8 6.5v3.2M8 11.8v.01"/>',
  off: '<circle cx="8" cy="8" r="5.8"/><path d="m3.9 12.1 8.2-8.2"/>',
};
const ICON_OF: Record<CellState, keyof typeof CELL_ICON> = { empty: 'box', full: 'box', issued: 'truck', damaged: 'tri', faulty: 'off', retired: 'off' };

const TOTALS = [
  { value: 96, color: '#1d3b6e', label: l('cells total', 'комірок усього') },
  { value: 38, color: STATES.empty.color, label: l('empty', 'порожні') },
  { value: 22, color: STATES.full.color, label: l('full', 'заповнені') },
  { value: 31, color: STATES.issued.color, label: l('issued', 'видані') },
  { value: 3, color: STATES.damaged.color, label: l('damaged content', 'пошкоджений вміст') },
  { value: 2, color: STATES.faulty.color, label: l('faulty / retired', 'несправні / виведені') },
];

const COPY = {
  overview: l('Cell overview', 'Огляд комірок'),
  live: l('live', 'наживо'),
  dialogTitle: l('Second issue today', 'Друга видача сьогодні'),
  dialogBody: l('Driver requests a second kit. Approve?', 'Водій запитує другий комплект. Схвалити?'),
  approve: l('Approve', 'Схвалити'),
  decline: l('Decline', 'Відхилити'),
  approved: l('Approved · cell 13 stays open', 'Схвалено · комірка 13 відчинена'),
  declined: l('Declined · request logged', 'Відхилено · запит записано'),
  open: l('open', 'відч.'),
};

type Props = {
  narrow: boolean;
  filter: Filter;
  onFilter: (filter: Filter) => void;
  hoverCell: number | null;
  onHoverCell: (n: number | null) => void;
};

/** The operator console beside the locker: totals, a filterable cell grid and a pending approval. */
export function CellOverview({ narrow, filter, onFilter, hoverCell, onHoverCell }: Props) {
  const { t } = useLang();
  const [decision, setDecision] = useState<'approved' | 'declined' | null>(null);
  const [secs, setSecs] = useState(4 * 60 + 52);

  useEffect(() => {
    if (decision) return;
    const id = window.setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [decision]);

  return (
    <div className={cx(styles.panel, narrow && styles.narrow)}>
      <div className={styles.bar}>
        <div className={styles.dots} aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <div className={styles.barTitle}>{t(COPY.overview)}</div>
        <div className={styles.live}>
          <b />
          <span>{t(COPY.live)}</span>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.totals}>
          {TOTALS.map((x) => (
            <div key={x.color + x.value} className={styles.total}>
              <span className={styles.totalValue} style={{ color: x.color }}>
                {x.value}
              </span>
              <span className={styles.totalLabel}>{t(x.label)}</span>
            </div>
          ))}
        </div>
        <div className={styles.chips}>
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className={styles.chip} aria-pressed={filter === f.id} onClick={() => onFilter(f.id)}>
              {f.id !== 'all' && <i style={{ background: STATES[f.id].color }} />}
              <span>{t(f.label)}</span>
            </button>
          ))}
        </div>
        <div className={styles.grid}>
          {CELLS.map((cl) => (
            <div
              key={cl.n}
              className={cx(styles.cell, cl.n === OPEN_CELL && styles.open, !matchesFilter(filter, cl.st) && styles.dim, hoverCell === cl.n && styles.hot)}
              style={{ '--c': STATES[cl.st].color } as CSSProperties}
              onPointerEnter={() => onHoverCell(cl.n)}
              onPointerLeave={() => onHoverCell(null)}
            >
              <svg viewBox="0 0 16 16" aria-hidden dangerouslySetInnerHTML={{ __html: CELL_ICON[ICON_OF[cl.st]] }} />
              <span className={styles.cellNo}>{String(cl.n).padStart(2, '0')}</span>
              <span className={styles.cellId}>{cl.n === OPEN_CELL ? t(COPY.open) : cl.id}</span>
            </div>
          ))}
        </div>
        <div className={styles.dialog}>
          <div className={styles.dialogTop}>
            <h4>{t(COPY.dialogTitle)}</h4>
            {!decision && (
              <span className={styles.timer}>
                {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}
              </span>
            )}
          </div>
          <p>{t(COPY.dialogBody)}</p>
          {decision ? (
            <div className={styles.result}>{t(COPY[decision])}</div>
          ) : (
            <div className={styles.buttons}>
              <button type="button" className={styles.yes} onClick={() => setDecision('approved')}>
                {t(COPY.approve)}
              </button>
              <button type="button" className={styles.no} onClick={() => setDecision('declined')}>
                {t(COPY.decline)}
              </button>
            </div>
          )}
        </div>
        <div className={styles.legend}>
          {(Object.keys(STATES) as CellState[]).map((k) => (
            <span key={k}>
              <i style={{ background: STATES[k].color }} />
              {t(STATES[k].label)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
