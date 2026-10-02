import { keyOf, useLang } from '../i18n';
import type { Stat } from '../types';
import { cx } from '../lib/cx';
import styles from './StatGrid.module.css';

type Props = { stats: Stat[]; size?: 'sm' | 'md' | 'lg' };

export function StatGrid({ stats, size = 'md' }: Props) {
  const { t } = useLang();
  return (
    <div className={cx(styles.grid, styles[size])}>
      {stats.map((stat) => (
        <div key={keyOf(stat.label)} className={styles.cell}>
          <div className={cx(styles.value, stat.accent && styles.accent)}>{t(stat.value)}</div>
          <div className={styles.label}>{t(stat.label)}</div>
        </div>
      ))}
    </div>
  );
}
