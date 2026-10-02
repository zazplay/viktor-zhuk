import { edu, jobs } from '../data/site';
import { ui } from '../data/ui';
import { keyOf, useLang } from '../i18n';
import { cx } from '../lib/cx';
import styles from './Sections.module.css';

export function Experience() {
  const { t } = useLang();
  return (
    <section id="experience" className={cx(styles.section, styles.white)}>
      <div className={styles.inner}>
        <h2 className={styles.h2}>{t(ui.experience)}</h2>
        {jobs.map((j) => (
          <div key={keyOf(j.period)} className={cx(styles.row, styles.job)}>
            <div className={styles.jobMeta}>
              <span className={styles.period}>{t(j.period)}</span>
              <span className={styles.company}>{t(j.company)}</span>
            </div>
            <div>
              <div className={styles.jobRole}>{t(j.role)}</div>
              <div className={styles.jobSummary}>{t(j.summary)}</div>
              <ul className={styles.points}>
                {j.points.map((pt) => (
                  <li key={keyOf(pt)}>{t(pt)}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        <h3 className={cx(styles.eyebrow, styles.educationTitle)}>{t(ui.education)}</h3>
        {edu.map((e) => (
          <div key={keyOf(e.title)} className={cx(styles.row, styles.edu)}>
            <span className={styles.eduPeriod}>{t(e.period)}</span>
            <div>
              <div className={styles.eduTitle}>{t(e.title)}</div>
              <div className={styles.eduPlace}>{t(e.place)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
