import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useLang, type Text } from '../i18n';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/useReveal';
import styles from './Section.module.css';

type Props = {
  /** Anchor target for the section nav. */
  id?: string;
  icon: LucideIcon;
  title: Text;
  /** Lower-case remark inside the heading, e.g. "— fictional data". */
  note?: Text;
  /** Right-aligned meta next to the heading, e.g. the period. */
  aside?: Text;
  /** Slightly smaller gap between heading and content. */
  tight?: boolean;
  children: ReactNode;
};

export function Section({ id, icon: Icon, title, note, aside, tight, children }: Props) {
  const { t } = useLang();
  const ref = useReveal<HTMLElement>();
  const heading = (
    <h2 className={styles.title}>
      <Icon size={13} className={styles.icon} aria-hidden />
      {t(title)}
      {note && <span className={styles.note}>{t(note)}</span>}
    </h2>
  );

  return (
    <section ref={ref} id={id} data-reveal className={cx(styles.section, tight && styles.tight)}>
      {aside ? (
        <div className={styles.head}>
          {heading}
          <span className={styles.aside}>{t(aside)}</span>
        </div>
      ) : (
        heading
      )}
      {children}
    </section>
  );
}
