import { Download, Mail, MapPin } from 'lucide-react';
import { profile, socials } from '../data/profile';
import { l, useLang } from '../i18n';
import { cx } from '../lib/cx';
import { BrandIcon } from './BrandIcon';
import { ExternalLink } from './ExternalLink';
import { LangSwitch } from './LangSwitch';
import styles from './Header.module.css';

export function Header() {
  const { t } = useLang();
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} />
          <span>{t(profile.role)}</span>
        </div>
        <LangSwitch />
      </div>
      <h1 className={styles.name}>{t(profile.name)}</h1>
      <div className={styles.location}>
        <MapPin size={14} className={styles.locationIcon} aria-hidden />
        {t(profile.location)}
      </div>
      <p className={styles.intro}>{t(profile.intro)}</p>
      <div className={styles.links}>
        <a href={`mailto:${profile.email}`} className={cx(styles.link, styles.email)}>
          <Mail size={16} className={styles.linkIcon} aria-hidden />
          {profile.email}
        </a>
        {socials.map((s) => (
          <ExternalLink key={s.id} href={s.href} className={cx(styles.link, styles[s.id])}>
            <BrandIcon brand={s.brand} size={16} />
            {s.label}
          </ExternalLink>
        ))}
        {profile.cv && (
          <a href={profile.cv} download className={cx(styles.link, styles.cv)}>
            <Download size={16} className={styles.linkIcon} aria-hidden />
            {t(l('Download CV', 'Завантажити CV'))}
          </a>
        )}
      </div>
    </header>
  );
}
