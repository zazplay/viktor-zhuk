import { skills } from '../data/site';
import { ui } from '../data/ui';
import { keyOf, useLang } from '../i18n';
import { cx } from '../lib/cx';
import styles from './Sections.module.css';

export function Skills() {
  const { t } = useLang();
  return (
    <section id="skills" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={cx(styles.h2, styles.skillsTitle)}>{t(ui.skills)}</h2>
        {skills.map((s) => (
          <div key={keyOf(s.title)} className={cx(styles.row, styles.skill)}>
            <div className={styles.skillTitle}>{t(s.title)}</div>
            <div className={styles.skillItems}>{t(s.items)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
