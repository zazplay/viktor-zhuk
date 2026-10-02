import { Download, Mail } from 'lucide-react';
import { brand } from '../data/brands';
import { links, profile } from '../data/profile';
import { l, useLang } from '../i18n';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/useReveal';
import { BrandIcon } from './BrandIcon';
import { ExternalLink } from './ExternalLink';
import styles from './ContactCta.module.css';

const COPY = {
  title: l(
    'Looking for an engineer who can own a system end to end?',
    'Шукаєте інженера, який веде систему від початку до кінця?',
  ),
  subtitle: l(
    'Open to full-stack roles — TypeScript, React, NestJS, Node. Happy to walk through the architecture in a call.',
    'Розглядаю full-stack ролі — TypeScript, React, NestJS, Node. Із задоволенням розповім про архітектуру на дзвінку.',
  ),
  email: l('Write an e-mail', 'Написати листа'),
  cv: l('Download CV', 'Завантажити CV'),
};

export function ContactCta() {
  const { t } = useLang();
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} id="contact" data-reveal className={styles.cta}>
      <div className={styles.text}>
        <h2 className={styles.title}>{t(COPY.title)}</h2>
        <p className={styles.subtitle}>{t(COPY.subtitle)}</p>
      </div>
      <div className={styles.actions}>
        <a href={`mailto:${profile.email}`} className={cx(styles.button, styles.primary)}>
          <Mail size={17} aria-hidden />
          {t(COPY.email)}
        </a>
        <ExternalLink href={links.telegram} className={cx(styles.button, styles.telegram)}>
          <BrandIcon brand={brand.telegram} size={17} />
          Telegram
        </ExternalLink>
        {profile.cv && (
          <a href={profile.cv} download className={cx(styles.button, styles.secondary)}>
            <Download size={17} aria-hidden />
            {t(COPY.cv)}
          </a>
        )}
      </div>
    </section>
  );
}
