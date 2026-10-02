import { KeyRound } from 'lucide-react';
import { l, useLang } from '../../i18n';
import styles from './EscrowHub.module.css';

export function EscrowHub() {
  const { t } = useLang();
  return (
    <div className={styles.hub}>
      <div className={styles.title}>
        <KeyRound size={16} className={styles.icon} aria-hidden />
        {t(l('Funds held in escrow', 'Кошти на ескроу'))}
      </div>
      <div className={styles.amount}>
        ◈ 1 250 <span className={styles.held}>{t(l('held', 'заблоковано'))}</span>
      </div>
      <div className={styles.progress} aria-hidden="true">
        <span style={{ width: '62%' }} />
      </div>
      <div className={styles.release}>{t(l('auto-release in 2 d 07 h', 'автовиплата через 2 д 07 год'))}</div>
    </div>
  );
}
