import type { ReactNode } from 'react';
import { useLang, type Text } from '../i18n';
import { cx } from '../lib/cx';
import styles from './WindowChrome.module.css';

type Props = {
  label: Text;
  size?: 'sm' | 'md';
  /** Extra content pushed to the right end of the bar. */
  children?: ReactNode;
};

/** Title bar of a mock app window: three dots and a label. */
export function WindowChrome({ label, size = 'md', children }: Props) {
  const { t } = useLang();
  return (
    <div className={cx(styles.bar, styles[size])}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.label}>{t(label)}</span>
      {children}
    </div>
  );
}
