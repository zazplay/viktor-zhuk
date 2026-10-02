import { keyOf, useLang } from '../i18n';
import type { TechTag, WorkItem } from '../types';
import { cx } from '../lib/cx';
import { BrandIcon } from './BrandIcon';
import styles from './WorkList.module.css';

type Props = { items: WorkItem[]; size?: 'md' | 'lg' };

const asTag = (tag: TechTag) => (typeof tag === 'object' && 'label' in tag ? tag : { label: tag, brand: undefined });

export function WorkList({ items, size = 'md' }: Props) {
  const { t } = useLang();
  let number = 0;

  return (
    <ol className={cx(styles.list, size === 'lg' && styles.lg)}>
      {items.map(({ icon: Icon, title, text, tags, meta, external }) => {
        const index = external ? '—' : String(++number).padStart(2, '0');
        return (
          <li key={keyOf(title)} className={cx(styles.item, external && styles.external)}>
            <span className={styles.index} aria-hidden="true">
              {index}
            </span>
            <div>
              <h4 className={styles.title}>
                <Icon size={15.5} className={styles.icon} aria-hidden />
                {t(title)}
              </h4>
              <div className={styles.description}>
                <p className={styles.text}>{t(text)}</p>
                {(tags || meta) && (
                  <div className={styles.tags}>
                    {tags?.map((tag) => {
                      const { label, brand } = asTag(tag);
                      return (
                        <span key={keyOf(label)} className={styles.tag}>
                          {brand && <BrandIcon brand={brand} size={12} />}
                          {t(label)}
                        </span>
                      );
                    })}
                    {meta && <span className={styles.meta}>{t(meta)}</span>}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
