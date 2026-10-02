import styles from './App.module.css';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Experience } from './components/Experience';
import { ProjectSection } from './components/ProjectSection';
import { Sidebar } from './components/Sidebar';
import { Skills } from './components/Skills';
import { projects } from './data/site';
import { useActiveSection } from './lib/useActiveSection';

const SECTION_IDS = [...projects.map((p) => p.id), 'experience', 'skills', 'contact'];

export default function App() {
  const active = useActiveSection(SECTION_IDS);
  return (
    <div className={styles.layout}>
      <Sidebar active={active} />
      <main className={styles.main}>
        <About />
        {projects.map((p, i) => (
          <ProjectSection key={p.id} project={p} index={i} />
        ))}
        <Experience />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}
