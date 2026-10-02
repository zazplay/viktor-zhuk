import { useRef, type ComponentType, type KeyboardEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { l, useLang, type Text } from '../i18n';
import styles from './ProjectTabs.module.css';

export type Tab<Id extends string> = {
  id: Id;
  label: Text;
  /** Short line under the title, in the same voice as the captions on the diagrams. */
  caption: Text;
  icon: LucideIcon;
  Preview: ComponentType;
};

type Props<Id extends string> = {
  id?: string;
  tabs: readonly Tab<Id>[];
  active: Id;
  onChange: (id: Id) => void;
};

export const tabId = (id: string) => `tab-${id}`;
export const panelId = (id: string) => `panel-${id}`;

export function ProjectTabs<Id extends string>({ id, tabs, active, onChange }: Props<Id>) {
  const { t } = useLang();
  const buttons = useRef(new Map<Id, HTMLButtonElement>());

  /** Arrow keys walk the tabs, as the tablist pattern expects. */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    const current = tabs.findIndex((tab) => tab.id === active);

    let next: Id | undefined;
    if (step) next = tabs[(current + step + tabs.length) % tabs.length].id;
    else if (event.key === 'Home') next = tabs[0].id;
    else if (event.key === 'End') next = tabs[tabs.length - 1].id;
    if (!next) return;

    event.preventDefault();
    onChange(next);
    buttons.current.get(next)?.focus();
  }

  return (
    <div id={id} className={styles.wrap}>
      <div role="tablist" aria-label={t(l('Projects', 'Проєкти'))} className={styles.list} onKeyDown={handleKeyDown}>
        {tabs.map(({ id, label, caption, icon: Icon, Preview }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={tabId(id)}
            data-project={id}
            aria-selected={id === active}
            aria-controls={panelId(id)}
            ref={(el) => {
              if (el) buttons.current.set(id, el);
              else buttons.current.delete(id);
            }}
            className={styles.tab}
            onClick={() => onChange(id)}
          >
            <span className={styles.preview} aria-hidden="true">
              <Preview />
            </span>
            <span className={styles.text}>
              <span className={styles.title}>
                <Icon size={14} className={styles.icon} aria-hidden />
                {t(label)}
              </span>
              <span className={styles.caption}>{t(caption)}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
