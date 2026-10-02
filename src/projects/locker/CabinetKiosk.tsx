import { QrCode } from 'lucide-react';
import { l, useLang } from '../../i18n';
import { cx } from '../../lib/cx';
import styles from './CabinetKiosk.module.css';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

/** Miniature of the touchscreen mounted on the cabinet: phone entry plus the QR scanner. */
export function CabinetKiosk() {
  const { t } = useLang();
  return (
    <div className={styles.column} aria-hidden="true">
      <div className={styles.label}>{t(l('Kiosk on the cabinet', 'Кіоск на шафі'))}</div>
      <div className={styles.frame}>
        <div className={styles.screen}>
          <div className={styles.prompt}>{t(l('Enter phone number', 'Введіть номер телефону'))}</div>
          <div className={styles.phone}>
            +•• ••• 42
            <span className={styles.caret} />
          </div>
          <div className={styles.keypad}>
            {KEYS.map((key, i) => (
              <div key={i} className={cx(styles.key, !key && styles.keyBlank)}>
                {key}
              </div>
            ))}
          </div>
          <div className={styles.send}>{t(l('Send code', 'Надіслати код'))}</div>
        </div>
        <div className={styles.scanner}>
          <div className={styles.scannerLabel}>
            <QrCode size={9} />
            {t(l('QR scanner', 'QR-сканер'))}
          </div>
          <div className={styles.scanArea}>
            <span className={styles.scanLine} />
          </div>
        </div>
      </div>
      <div className={styles.spec}>{t(l('900×1440 · portrait', '900×1440 · вертикально'))}</div>
    </div>
  );
}
