import { useState } from 'react';
import { Briefcase, Wrench } from 'lucide-react';
import { ContactCta } from './components/ContactCta';
import { Experience } from './components/Experience';
import { Section } from './components/Section';
import { SectionNav } from './components/SectionNav';
import { Skills } from './components/Skills';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ProjectTabs, panelId, tabId } from './components/ProjectTabs';
import { l } from './i18n';
import { projects, type ProjectId } from './projects';
import styles from './App.module.css';

export default function App() {
  const [activeId, setActiveId] = useState<ProjectId>('pay');
  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  // data-project carries the project's colour palette down the page.
  return (
    <div className={styles.page} data-project={active.id}>
      <div className={styles.flow}>
        <Header />
        <main className={styles.flow}>
          <ProjectTabs id="projects" tabs={projects} active={active.id} onChange={setActiveId} />
          <div role="tabpanel" id={panelId(active.id)} aria-labelledby={tabId(active.id)} className={styles.flow}>
            <active.Content />
          </div>
          <Section id="experience" icon={Briefcase} title={l("Where I've worked", 'Де я працював')}>
            <Experience />
          </Section>
          <Section id="skills" icon={Wrench} title={l('What I work with', 'З чим я працюю')} tight>
            <Skills />
          </Section>
          <ContactCta />
        </main>
        <Footer />
        <SectionNav />
      </div>
    </div>
  );
}
