import { useEffect, useRef, useState } from 'react';
import { l, useLang } from '../i18n';
import { cx } from '../lib/cx';
import styles from './SectionNav.module.css';

const SECTIONS = [
  { id: 'projects', label: l('Projects', 'Проєкти') },
  { id: 'experience', label: l('Experience', 'Досвід') },
  { id: 'skills', label: l('Skills', 'Навички') },
  { id: 'contact', label: l('Contact', 'Контакти') },
];

/** How far down the screen a section must start to count as the one being read. */
const READING_LINE = 0.35;

/**
 * The section being read is the last one whose top has scrolled past the reading line;
 * a section stays active all the way down to where the next one starts. At the very
 * bottom the last section wins, since a short final section never reaches the line.
 */
function currentSection(): string {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) return SECTIONS[SECTIONS.length - 1].id;

  const line = window.innerHeight * READING_LINE;
  let current = SECTIONS[0].id;
  for (const { id } of SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) current = id;
  }
  return current;
}

/** A rail in the left margin on wide screens; it follows what is on screen. */
export function SectionNav() {
  const { t } = useLang();
  const [active, setActive] = useState(SECTIONS[0].id);
  // After a click the clicked item keeps the highlight until its scroll settles; near the bottom
  // of the page the position alone cannot tell the last two sections apart.
  const clicked = useRef<string | null>(null);
  const release = useRef(0);

  const holdClicked = () => {
    window.clearTimeout(release.current);
    release.current = window.setTimeout(() => (clicked.current = null), 160);
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (clicked.current) {
        holdClicked();
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(currentSection()));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(release.current);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <nav className={styles.nav} aria-label={t(l('Sections', 'Розділи'))}>
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={cx(styles.item, id === active && styles.active)}
          aria-current={id === active ? 'true' : undefined}
          onClick={() => {
            clicked.current = id;
            setActive(id);
            holdClicked();
          }}
        >
          <span className={styles.mark} />
          {t(label)}
        </a>
      ))}
    </nav>
  );
}
