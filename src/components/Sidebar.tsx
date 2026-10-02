import photo from '../assets/photo.jpg';
import { cta, cvLinkAttrs, profile, projects, socials } from '../data/site';
import { ui } from '../data/ui';
import { LANGS, useLang } from '../i18n';
import { cx } from '../lib/cx';
import button from './Button.module.css';
import styles from './Sidebar.module.css';

const PROJECT_IDS = new Set<string>(projects.map((p) => p.id));

/** Navy column with the photo, contacts and section navigation; sticky on wide screens. */
export function Sidebar({ active }: { active: string | null }) {
  const { lang, setLang, t } = useLang();
  const inProjects = !active || PROJECT_IDS.has(active);

  return (
    <aside className={styles.aside}>
      <div className={styles.identity}>
        <div className={styles.top}>
          <img src={photo} alt={t(profile.name)} className={styles.photo} />
          <div className={styles.langs} role="group" aria-label="Language">
            {LANGS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={styles.lang}
                aria-pressed={lang === option.id}
                onClick={() => setLang(option.id)}
                title={option.name}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.name}>{t(profile.name)}</div>
          <div className={styles.role}>{t(profile.role)}</div>
          <div className={styles.location}>{t(profile.location)}</div>
        </div>
      </div>

      <div className={styles.actions}>
        <a href={`mailto:${profile.email}`} className={cx(button.button, button.primary)}>
          {t(cta.email)}
        </a>
        {profile.cv && (
          <a href={profile.cv} download={profile.cvName} {...cvLinkAttrs} className={cx(button.button, button.secondary)}>
            {t(cta.cv)}
          </a>
        )}
        <div className={styles.socials}>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} aria-label={s.label} className={styles.social}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                <path d={s.icon.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      <nav className={styles.nav}>
        <a href="#projects" className={cx(styles.navLink, inProjects && styles.on)}>
          {t(ui.projects)}
        </a>
        {projects.map((p) => (
          <a key={p.id} href={`#${p.id}`} className={cx(styles.navSub, active === p.id && styles.on)}>
            {t(p.title)}
          </a>
        ))}
        <a href="#experience" className={cx(styles.navLink, styles.navGap, active === 'experience' && styles.on)}>
          {t(ui.experience)}
        </a>
        <a href="#skills" className={cx(styles.navLink, active === 'skills' && styles.on)}>
          {t(ui.skills)}
        </a>
        <a href="#contact" className={cx(styles.navLink, active === 'contact' && styles.on)}>
          {t(ui.contact)}
        </a>
      </nav>
    </aside>
  );
}
