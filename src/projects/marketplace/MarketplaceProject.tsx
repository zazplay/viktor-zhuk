import { Activity, Server, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/Card';
import { HubDiagram } from '../../components/Flow';
import { l } from '../../i18n';
import { ProjectOverview } from '../../components/ProjectOverview';
import { ProofGrid } from '../../components/ProofGrid';
import { Section } from '../../components/Section';
import { StackGroups } from '../../components/StackGroups';
import { EscrowHub } from './EscrowHub';
import { NotificationMatrix } from './NotificationMatrix';
import { escrow, overview, proofs, reliability, stack } from './data';
import styles from './MarketplaceProject.module.css';

export function MarketplaceProject() {
  return (
    <>
      <Section icon={ShieldCheck} title={l('How the escrow works', 'Як працює ескроу')} aside={l('fictional amounts', 'вигадані суми')}>
        <Card padding="lg">
          <HubDiagram inputs={escrow.inputs} hub={<EscrowHub />} caption={escrow.caption} outputs={escrow.outputs} />
        </Card>
      </Section>
      <Section icon={Activity} title={l('Payments that never get lost', 'Платежі, які не губляться')}>
        <Card padding="lg" className={styles.reliability}>
          <ProofGrid items={reliability} />
          <NotificationMatrix />
        </Card>
      </Section>
      <ProjectOverview data={overview} />
      <Section icon={ShieldCheck} title={l('What this proves', 'Що це доводить')}>
        <ProofGrid items={proofs} />
      </Section>
      <Section icon={Server} title={l('Stack', 'Стек')} tight>
        <StackGroups groups={stack} />
      </Section>
    </>
  );
}
