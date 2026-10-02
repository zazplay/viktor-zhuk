import { Card } from '../../components/Card';
import { keyOf, useLang } from '../../i18n';
import { jobs } from './data';
import styles from './ScheduledJobs.module.css';

/** The clock the service runs on: five jobs that keep money and orders from hanging. */
export function ScheduledJobs() {
  const { t } = useLang();
  return (
    <Card padding="none" className={styles.card}>
      {jobs.map(({ every, does }) => (
        <div key={keyOf(every)} className={styles.job}>
          <span className={styles.every}>{t(every)}</span>
          <span className={styles.does}>{t(does)}</span>
        </div>
      ))}
    </Card>
  );
}
