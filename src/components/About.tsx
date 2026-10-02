import { nda, profile, totals } from '../data/site';
import { ui } from '../data/ui';
import { useLang } from '../i18n';
import { cx } from '../lib/cx';
import styles from './Sections.module.css';

/** Intro paragraph and the four headline numbers, followed by the NDA note above the projects. */
export function About() {
  const { t } = useLang();
  return (
    <>
      <section className={cx(styles.section, styles.white)}>
        <div className={styles.about}>
          <h1 className={styles.eyebrow}>{t(ui.about)}</h1>
          <p className={styles.intro}>{t(profile.intro)}</p>
          <div className={styles.totals}>
            {totals.map((x) => (
              <div key={x.value} className={styles.total}>
                <div className={styles.totalValue}>{x.value}</div>
                <div className={styles.totalLabel}>{t(x.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div id="projects" className={styles.nda}>
        {t(nda)}
      </div>
    </>
  );
}
