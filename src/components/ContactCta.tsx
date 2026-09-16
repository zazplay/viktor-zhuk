import { Download, Mail } from 'lucide-react';
import { brand } from '../data/brands';
import { links, profile } from '../data/profile';
import { BrandIcon } from './BrandIcon';
import { ExternalLink } from './ExternalLink';
import { cx } from '../lib/cx';
import styles from './ContactCta.module.css';

export function ContactCta() {
  return (
    <section className={styles.cta}>
      <div className={styles.text}>
        <h2 className={styles.title}>Looking for an engineer who can own a system end to end?</h2>
        <p className={styles.subtitle}>
          Open to full-stack roles — TypeScript, React, NestJS, Node. Happy to walk through the architecture in a call.
        </p>
      </div>
      <div className={styles.actions}>
        <a href={`mailto:${profile.email}`} className={cx(styles.button, styles.primary)}>
          <Mail size={17} aria-hidden />
          Write an e-mail
        </a>
        <ExternalLink href={links.telegram} className={cx(styles.button, styles.telegram)}>
          <BrandIcon brand={brand.telegram} size={17} />
          Telegram
        </ExternalLink>
        {profile.cv && (
          <a href={profile.cv} download className={cx(styles.button, styles.secondary)}>
            <Download size={17} aria-hidden />
            Download CV
          </a>
        )}
      </div>
    </section>
  );
}
