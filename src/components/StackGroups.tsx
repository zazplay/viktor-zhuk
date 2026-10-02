import { keyOf, useLang } from '../i18n';
import type { StackGroup, StackItem } from '../types';
import { BrandIcon } from './BrandIcon';
import { ExternalLink } from './ExternalLink';
import styles from './StackGroups.module.css';

const asChip = (item: StackItem) =>
  typeof item === 'object' && 'label' in item ? item : { label: item, href: undefined, brand: undefined };

function Chip({ item }: { item: StackItem }) {
  const { t } = useLang();
  const { label, href, brand } = asChip(item);
  const content = (
    <>
      {brand && <BrandIcon brand={brand} size={15} className={styles.icon} />}
      {t(label)}
    </>
  );

  return href ? (
    <ExternalLink href={href} className={styles.chip}>
      {content}
    </ExternalLink>
  ) : (
    <span className={styles.chip}>{content}</span>
  );
}

export function StackGroups({ groups }: { groups: StackGroup[] }) {
  const { t } = useLang();
  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <div key={keyOf(group.title)} className={styles.group}>
          <h3 className={styles.label}>{t(group.title)}</h3>
          <div className={styles.chips}>
            {group.items.map((item) => (
              <Chip key={keyOf(asChip(item).label)} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
