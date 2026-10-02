import { Package } from 'lucide-react';
import { l, useLang } from '../i18n';
import type { Overview } from '../types';
import { Card } from './Card';
import { Section } from './Section';
import { StatGrid } from './StatGrid';
import { WorkList } from './WorkList';
import styles from './ProjectOverview.module.css';

type Props = {
  data: Overview;
  statSize?: 'md' | 'lg';
  workSize?: 'md' | 'lg';
};

/** The project card: title, summary, headline numbers and the apps that make up the project. */
export function ProjectOverview({ data, statSize = 'lg', workSize = 'md' }: Props) {
  const { t } = useLang();
  return (
    <Section icon={Package} title={l('Selected work', 'Огляд проєкту')} aside={data.period}>
      <Card className={styles.card}>
        <div className={styles.intro}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{t(data.title)}</h3>
            <span className={styles.badge}>{t(data.badge)}</span>
          </div>
          <p className={styles.summary}>{t(data.summary)}</p>
        </div>
        <StatGrid stats={data.stats} size={statSize} />
        <WorkList items={data.work} size={workSize} />
        {data.footnote && <p className={styles.footnote}>{t(data.footnote)}</p>}
      </Card>
    </Section>
  );
}
