import type { ComponentType } from 'react';
import { LANGS, useLang, type Lang } from '../i18n';
import { cx } from '../lib/cx';
import styles from './LangSwitch.module.css';

/** Union Jack, simplified for 18px: the counterchanged diagonals are invisible at this size. */
function FlagGB() {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FlagUA() {
  return (
    <svg viewBox="0 0 3 2" aria-hidden="true" focusable="false">
      <rect width="3" height="1" fill="#0057B7" />
      <rect y="1" width="3" height="1" fill="#FFD700" />
    </svg>
  );
}

const FLAGS: Record<Lang, ComponentType> = { en: FlagGB, uk: FlagUA };

export function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className={styles.switch} role="group" aria-label="Language · Мова">
      {LANGS.map(({ id, label, name }) => {
        const Flag = FLAGS[id];
        return (
          <button
            key={id}
            type="button"
            lang={id}
            aria-label={name}
            aria-pressed={id === lang}
            className={cx(styles.option, id === lang && styles.active)}
            onClick={() => setLang(id)}
          >
            <span className={styles.flag}>
              <Flag />
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
