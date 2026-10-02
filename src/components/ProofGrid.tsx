import { keyOf, useLang } from '../i18n';
import type { Proof } from '../types';
import styles from './ProofGrid.module.css';

export function ProofGrid({ items }: { items: Proof[] }) {
  const { t } = useLang();
  return (
    <div className={styles.grid}>
      {items.map(({ icon: Icon, title, text }) => (
        <div key={keyOf(title)} className={styles.item}>
          <h3 className={styles.title}>
            <Icon size={15} className={styles.icon} aria-hidden />
            {t(title)}
          </h3>
          <p className={styles.text}>{t(text)}</p>
        </div>
      ))}
    </div>
  );
}
