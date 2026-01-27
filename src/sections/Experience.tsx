import { Briefcase } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import TimelineItem from '../components/TimelineItem';
import { experiences } from '../data/data';

const Experience = () => {
  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <SectionHeader 
          icon={<Briefcase />}
          title="Experiência Profissional"
          subtitle="Minha jornada no desenvolvimento de software"
        />
        
        <div className="timeline">
          {experiences.map((exp, index) => (
            <TimelineItem 
              key={index} 
              experience={exp} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
