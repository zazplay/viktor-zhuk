import { skills } from '../data/career';
import { keyOf, useLang } from '../i18n';
import styles from './Skills.module.css';

/** The whole toolbox in one place; per-project stacks live inside each tab. */
export function Skills() {
  const { t } = useLang();
  return (
    <dl className={styles.list}>
      {skills.map(({ title, items }) => (
        <div key={keyOf(title)} className={styles.row}>
          <dt className={styles.label}>{t(title)}</dt>
          <dd className={styles.items}>{t(items)}</dd>
        </div>
      ))}
    </dl>
  );
}
