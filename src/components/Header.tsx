import { Download, Mail, MapPin } from 'lucide-react';
import { profile, socials } from '../data/profile';
import { cx } from '../lib/cx';
import { BrandIcon } from './BrandIcon';
import { ExternalLink } from './ExternalLink';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.eyebrow}>
        <span className={styles.dot} />
        <span>{profile.role}</span>
      </div>
      <h1 className={styles.name}>{profile.name}</h1>
      <div className={styles.location}>
        <MapPin size={14} className={styles.locationIcon} aria-hidden />
        {profile.location}
      </div>
      <p className={styles.intro}>{profile.intro}</p>
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
            Download CV
          </a>
        )}
      </div>
    </header>
  );
}
