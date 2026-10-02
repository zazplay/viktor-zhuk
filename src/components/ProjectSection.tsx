import { lazy, Suspense } from 'react';
import { icons, screenshots, type Project, type ProjectId } from '../data/site';
import { ui } from '../data/ui';
import { keyOf, useLang } from '../i18n';
import { cx } from '../lib/cx';
import styles from './Project.module.css';
import sections from './Sections.module.css';

// three.js only loads once a page with a model renders, in its own chunk.
const MODELS: Partial<Record<ProjectId, ReturnType<typeof lazy>>> = {
  pay: lazy(() => import('../models/KioskModel')),
  locker: lazy(() => import('../models/LockerModel')),
};

/** Brand colours too light to read on white fall back to ink. */
function iconColor(hex: string) {
  const n = parseInt(hex, 16);
  const luma = ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
  return luma > 200 ? 'var(--ink)' : `#${hex}`;
}

export function ProjectSection({ project: p, index }: { project: Project; index: number }) {
  const { t } = useLang();
  const Model = MODELS[p.id];
  const shots = screenshots[p.id] ?? [];

  return (
    <section id={p.id} className={sections.section}>
      <div className={sections.inner}>
        <div className={styles.meta}>
          <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
          <span>{t(p.period)}</span>
          <span className={styles.badge}>{t(p.badge)}</span>
        </div>
        <h2 className={styles.title}>{t(p.title)}</h2>
        <p className={styles.summary}>{t(p.summary)}</p>
        <div className={styles.stats}>
          {p.stats.map((s) => (
            <div key={keyOf(s.label)} className={styles.stat}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{t(s.label)}</div>
            </div>
          ))}
        </div>

        {Model && (
          <Suspense fallback={<div className={styles.model} />}>
            <Model />
          </Suspense>
        )}

        {shots.length > 0 && (
          <div className={styles.shots}>
            {shots.map((shot, k) => (
              // A lone shot, or the first of an odd number, spans the full width.
              <figure key={shot.src} className={cx(styles.shot, (shots.length <= 2 || (k === 0 && shots.length % 2 === 1)) && styles.full)}>
                <div className={styles.frame} style={{ aspectRatio: shot.ratio ?? '2380 / 1494' }}>
                  <img src={shot.src} alt={t(shot.caption)} loading="lazy" />
                </div>
                <figcaption className={styles.caption}>{t(shot.caption)}</figcaption>
              </figure>
            ))}
          </div>
        )}

        <h3 className={cx(sections.eyebrow, styles.heading)}>{t(ui.built)}</h3>
        <div className={styles.work}>
          {p.work.map((w) => (
            <div key={keyOf(w.title)} className={styles.workItem}>
              <div className={styles.workTitle}>{t(w.title)}</div>
              <div className={styles.workText}>{t(w.text)}</div>
            </div>
          ))}
        </div>

        <h3 className={cx(sections.eyebrow, styles.heading)}>{t(ui.proves)}</h3>
        <div className={styles.proofs}>
          {p.proofs.map((q) => (
            <div key={keyOf(q.title)} className={styles.proof}>
              <div className={styles.proofTitle}>{t(q.title)}</div>
              <div className={styles.proofText}>{t(q.text)}</div>
            </div>
          ))}
        </div>

        <h3 className={cx(sections.eyebrow, styles.heading)}>{t(ui.stack)}</h3>
        <div className={styles.stack}>
          {p.stack.map((g) => (
            <div key={keyOf(g.title)} className={styles.group}>
              <div className={styles.groupTitle}>{t(g.title)}</div>
              <div className={styles.chips}>
                {g.items.map((it) => {
                  const icon = it.icon ? icons[it.icon] : undefined;
                  return (
                    <span key={keyOf(it.label)} className={styles.chip}>
                      {icon && (
                        <svg viewBox="0 0 24 24" width="15" height="15" fill={iconColor(icon.hex)} aria-hidden>
                          <path d={icon.path} />
                        </svg>
                      )}
                      {t(it.label)}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {p.footnote && <p className={styles.footnote}>{t(p.footnote)}</p>}
      </div>
    </section>
  );
}
