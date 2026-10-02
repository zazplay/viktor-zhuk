import { GraduationCap } from 'lucide-react';
import { education, jobs } from '../data/career';
import { keyOf, l, useLang } from '../i18n';
import { Card } from './Card';
import styles from './Experience.module.css';

/** Where the work happened: roles, dates and what each one involved. */
export function Experience() {
  const { t } = useLang();
  return (
    <Card className={styles.card}>
      <ol className={styles.jobs}>
        {jobs.map(({ role, company, period, summary, points }) => (
          <li key={keyOf(company)} className={styles.job}>
            <div className={styles.head}>
              <h3 className={styles.role}>{t(role)}</h3>
              <span className={styles.period}>{t(period)}</span>
            </div>
            <div className={styles.company}>{t(company)}</div>
            <p className={styles.summary}>{t(summary)}</p>
            <ul className={styles.points}>
              {points.map((point) => (
                <li key={keyOf(point)}>{t(point)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className={styles.education}>
        <h3 className={styles.educationTitle}>
          <GraduationCap size={14} className={styles.educationIcon} aria-hidden />
          {t(l('Education', 'Освіта'))}
        </h3>
        {education.map(({ title, place, period }) => (
          <div key={keyOf(title)} className={styles.degree}>
            <span className={styles.degreeTitle}>{t(title)}</span>
            <span className={styles.degreePlace}>{t(place)}</span>
            <span className={styles.period}>{period}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
