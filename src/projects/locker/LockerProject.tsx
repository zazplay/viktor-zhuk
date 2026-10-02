import { Activity, LayoutGrid, Server, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/Card';
import { l } from '../../i18n';
import { FlowNode, HubDiagram } from '../../components/Flow';
import { ProjectOverview } from '../../components/ProjectOverview';
import { ProofGrid } from '../../components/ProofGrid';
import { Section } from '../../components/Section';
import { StackGroups } from '../../components/StackGroups';
import { CellOverview } from './CellOverview';
import { channels, overview, proofs, stack } from './data';

export function LockerProject() {
  return (
    <>
      <Section icon={LayoutGrid} title={l('The whole wall on one screen', 'Уся стіна на одному екрані')} aside={l('dispatcher panel · fictional data', 'панель диспетчера · вигадані дані')}>
        <CellOverview />
      </Section>
      <Section icon={Activity} title={l('One event → three channels', 'Одна подія → три канали')}>
        <Card padding="lg">
          <HubDiagram
            inputs={channels.inputs}
            hub={<FlowNode {...channels.hub} hub />}
            caption={channels.caption}
            outputs={channels.outputs}
          />
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
