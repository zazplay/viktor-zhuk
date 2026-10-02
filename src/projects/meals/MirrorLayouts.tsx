import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../components/Card';
import { l, useLang, type Text } from '../../i18n';
import styles from './MirrorLayouts.module.css';

/**
 * The same screen in both directions. The right-hand one is not a picture of Hebrew —
 * it is the same markup with dir="rtl", the way the storefront flips for real.
 */
function MiniScreen({ dir, label }: { dir: 'ltr' | 'rtl'; label: Text }) {
  const { t } = useLang();
  return (
    <div className={styles.column}>
      <div className={styles.label}>{t(label)}</div>
      <div className={styles.screen} dir={dir} aria-hidden="true">
        <div className={styles.head}>
          <ArrowLeft size={12} className={styles.arrow} />
          <span className={styles.headBar} />
        </div>
        <div className={styles.item}>
          <span className={styles.thumb} />
          <span className={styles.lines}>
            <span />
            <span />
          </span>
          <span className={styles.price}>◈ 48</span>
        </div>
        <div className={styles.button}>
          <span className={styles.buttonBar} />
          <ChevronRight size={11} className={styles.arrow} />
        </div>
      </div>
    </div>
  );
}

export function MirrorLayouts() {
  const { t } = useLang();
  return (
    <Card padding="lg" className={styles.card}>
      <div className={styles.screens}>
        <MiniScreen dir="ltr" label={l('ltr · left to right', 'ltr · зліва направо')} />
        <MiniScreen dir="rtl" label={l('rtl · right to left', 'rtl · справа наліво')} />
      </div>
      <p className={styles.note}>
        {t(
          l(
            'Four locales share one layout. For Hebrew the interface turns around completely — reading direction, the order of controls, arrows and the side every margin sits on — so the screen reads as though it was drawn that way.',
            'Чотири локалі мають один макет. Для івриту інтерфейс розвертається повністю — напрям читання, порядок елементів, стрілки й бік кожного відступу, — тож екран читається так, ніби його так і малювали.',
          ),
        )}
      </p>
    </Card>
  );
}
