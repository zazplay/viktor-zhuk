import { Card } from '../../components/Card';
import { keyOf, l, useLang } from '../../i18n';
import { cx } from '../../lib/cx';
import { terminals, type TerminalStatus } from './data';
import styles from './ConsoleTable.module.css';

const COLUMNS = [l('Terminal', 'Термінал'), l('Notes', 'Купюри'), l('Coins', 'Монети'), l('Status', 'Статус')];

const STATUS_LABEL = {
  online: l('online', 'онлайн'),
  low: l('low cash', 'мало готівки'),
  offline: l('offline · syncing', 'офлайн · синхр.'),
} satisfies Record<TerminalStatus, unknown>;

export function ConsoleTable() {
  const { t } = useLang();
  return (
    <Card padding="none" className={styles.card}>
      <div className={styles.summary}>
        <span>{t(l('Terminals · 24', 'Термінали · 24'))}</span>
        <span className={styles.counts}>
          <span className={styles.ink}>{t(l('22 online', '22 онлайн'))}</span>
          <span>{t(l('1 offline', '1 офлайн'))}</span>
          <span className={styles.accent}>{t(l('1 low cash', '1 мало готівки'))}</span>
        </span>
      </div>
      <div role="table" aria-label={t(l('Terminals', 'Термінали'))}>
        <div role="row" className={cx(styles.row, styles.head)}>
          {COLUMNS.map((column) => (
            <span key={keyOf(column)} role="columnheader">
              {t(column)}
            </span>
          ))}
        </div>
        {terminals.map((terminal) => (
          <div key={keyOf(terminal.name)} role="row" className={styles.row}>
            <span role="cell">{t(terminal.name)}</span>
            <span role="cell" className={styles.mono}>
              {terminal.notes}
            </span>
            <span role="cell" className={styles.mono}>
              {terminal.coins}
            </span>
            <span role="cell" className={cx(styles.status, styles[terminal.status])}>
              {t(STATUS_LABEL[terminal.status])}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
