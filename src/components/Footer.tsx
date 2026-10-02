import { Mail } from 'lucide-react';
import { profile, socials } from '../data/profile';
import { l, useLang } from '../i18n';
import { cx } from '../lib/cx';
import { BrandIcon } from './BrandIcon';
import { ExternalLink } from './ExternalLink';
import styles from './Footer.module.css';

const NDA = l(
  'Under NDA: client, brand, hardware vendors and integrations are not named; all figures on screens are fictional.',
  'За NDA: клієнт, бренд, постачальники обладнання та інтеграції не називаються; усі цифри на екранах вигадані.',
);

export function Footer() {
  const { t } = useLang();
  return (
    <footer className={styles.footer}>
      <p className={styles.note}>{t(NDA)}</p>
      <nav className={styles.links} aria-label={t(l('Contacts', 'Контакти'))}>
        <a href={`mailto:${profile.email}`} className={cx(styles.link, styles.email)}>
          <Mail size={13} aria-hidden />
          {t(l('E-mail', 'Пошта'))}
        </a>
        {socials.map((s) => (
          <ExternalLink key={s.id} href={s.href} className={cx(styles.link, styles[s.id])}>
            <BrandIcon brand={s.brand} size={13} />
            {s.label}
          </ExternalLink>
        ))}
      </nav>
    </footer>
  );
}
