import { cta, cvLinkAttrs, profile } from '../data/site';
import { useLang } from '../i18n';
import { cx } from '../lib/cx';
import button from './Button.module.css';
import styles from './Sections.module.css';

export function Contact() {
  const { t } = useLang();
  return (
    <section id="contact" className={styles.contact}>
      <div className={cx(styles.inner, styles.contactInner)}>
        <div className={styles.contactText}>
          <h2 className={styles.contactTitle}>{t(cta.title)}</h2>
          <p className={styles.contactSubtitle}>{t(cta.subtitle)}</p>
        </div>
        <div className={styles.contactActions}>
          <a href={`mailto:${profile.email}`} className={cx(button.button, button.primary, button.large)}>
            {t(cta.email)}
          </a>
          <a href={profile.telegram} target="_blank" rel="noopener noreferrer" className={cx(button.button, button.secondary, button.large)}>
            Telegram
          </a>
          {profile.cv && (
            <a href={profile.cv} download={profile.cvName} {...cvLinkAttrs} className={cx(button.button, button.secondary, button.large)}>
              {t(cta.cv)}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
