import { Cloud, Cpu, LayoutGrid, Server, ShieldCheck } from 'lucide-react';
import { ProjectOverview } from '../../components/ProjectOverview';
import { l } from '../../i18n';
import { ProofGrid } from '../../components/ProofGrid';
import { Section } from '../../components/Section';
import { StackGroups } from '../../components/StackGroups';
import { ConsoleTable } from './ConsoleTable';
import { FleetDiagram } from './FleetDiagram';
import { KioskAnatomy } from './KioskAnatomy';
import { overview, proofs, stack } from './data';

export function PaymentProject() {
  return (
    <>
      <Section icon={Cpu} title={l('Anatomy of the kiosk', 'Анатомія кіоску')}>
        <KioskAnatomy />
      </Section>
      <Section icon={Cloud} title={l('Fleet → cloud → one console', 'Парк → хмара → одна консоль')}>
        <FleetDiagram />
      </Section>
      <Section icon={LayoutGrid} title={l('Operator console', 'Консоль оператора')} note={l('— fictional data', '— вигадані дані')}>
        <ConsoleTable />
      </Section>
      <ProjectOverview data={overview} statSize="md" workSize="lg" />
      <Section icon={ShieldCheck} title={l('What this proves', 'Що це доводить')}>
        <ProofGrid items={proofs} />
      </Section>
      <Section icon={Server} title={l('Stack', 'Стек')} tight>
        <StackGroups groups={stack} />
      </Section>
    </>
  );
}
