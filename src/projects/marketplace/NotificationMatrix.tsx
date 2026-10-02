import { Bell, Mail, ShieldCheck, Smartphone } from 'lucide-react';
import { Fragment } from 'react';
import { keyOf, l, useLang } from '../../i18n';
import { cx } from '../../lib/cx';
import { notificationEvents } from './data';
import styles from './NotificationMatrix.module.css';

const CHANNELS = [
  { icon: Bell, label: l('In-app', 'У застосунку') },
  { icon: Smartphone, label: l('Mobile', 'Мобільний') },
  { icon: Mail, label: l('E-mail', 'Пошта') },
];

/** Which channel each event goes to, as users configure it. */
export function NotificationMatrix() {
  const { t } = useLang();
  return (
    <div className={styles.block}>
      <div className={styles.title}>{t(l('22 events × 3 channels — the user picks', '22 події × 3 канали — обирає користувач'))}</div>
      <div className={styles.matrix}>
        <span />
        {CHANNELS.map(({ icon: Icon, label }) => (
          <span key={keyOf(label)} className={styles.channel} role="img" aria-label={t(label)} title={t(label)}>
            <Icon size={11} aria-hidden />
          </span>
        ))}
        {notificationEvents.map(({ event, channels }) => (
          <Fragment key={keyOf(event)}>
            <span className={styles.event}>{t(event)}</span>
            {channels.map((on, i) => (
              <span
                key={i}
                className={cx(styles.toggle, on ? styles.on : styles.off)}
                role="img"
                aria-label={`${t(CHANNELS[i].label)}: ${t(on ? l('on', 'увімк.') : l('off', 'вимк.'))}`}
              >
                {on && <ShieldCheck size={12} aria-hidden />}
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
