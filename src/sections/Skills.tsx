import { Code2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SkillCard from '../components/SkillCard';
import { skills } from '../data/data';

const Skills = () => {
  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <SectionHeader 
          icon={<Code2 />}
          title="Habilidades Técnicas"
          subtitle="Tecnologias e ferramentas que domino"
        />
        
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <SkillCard 
              key={index} 
              skill={skill} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
