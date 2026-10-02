import { CalendarDays, Languages, Server, ShieldCheck, Timer, Truck } from 'lucide-react';
import { ProjectOverview } from '../../components/ProjectOverview';
import { l } from '../../i18n';
import { ProofGrid } from '../../components/ProofGrid';
import { Section } from '../../components/Section';
import { StackGroups } from '../../components/StackGroups';
import { MirrorLayouts } from './MirrorLayouts';
import { OrderRail } from './OrderRail';
import { ScheduledJobs } from './ScheduledJobs';
import { WeekPlan } from './WeekPlan';
import { overview, proofs, stack } from './data';

export function MealsProject() {
  return (
    <>
      <Section icon={CalendarDays} title={l('A week on the plan', 'Тиждень за планом')} aside={l('fictional prices', 'вигадані ціни')}>
        <WeekPlan />
      </Section>
      <Section icon={Truck} title={l('From order to door', 'Від замовлення до дверей')}>
        <OrderRail />
      </Section>
      <Section icon={Timer} title={l('Five jobs on a clock', 'Пʼять задач за розкладом')}>
        <ScheduledJobs />
      </Section>
      <Section icon={Languages} title={l('Four languages, one mirrored', 'Чотири мови, одна дзеркальна')}>
        <MirrorLayouts />
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
