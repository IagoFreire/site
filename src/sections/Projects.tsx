import { Rocket, Github, ExternalLink } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import { projects } from '../data/data';

const Projects = () => {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionHeader 
          icon={<Rocket />}
          title="Projetos em Destaque"
          subtitle="Projetos que desenvolvi com foco em produto e experiência real"
        />
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project} 
              index={index}
            />
          ))}
        </div>
        
        <div className="projects-cta">
          <p>Quer ver mais?</p>
          <Button 
            variant="secondary"
            href="https://github.com/IagoFreire"
            icon={<Github size={20} />}
          >
            Ver todos os repositórios
            <ExternalLink size={16} style={{ marginLeft: '0.5rem' }} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
