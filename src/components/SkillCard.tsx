import type { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
  index: number;
}

const SkillCard = ({ skill, index }: SkillCardProps) => {
  return (
    <div 
      className="skill-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="skill-header">
        <span className="skill-icon">{skill.icon}</span>
        <span className="skill-name">{skill.name}</span>
      </div>
      <div className="skill-bar-container">
        <div 
          className="skill-bar"
          style={{ 
            width: `${skill.level}%`,
            animationDelay: `${index * 0.1 + 0.5}s`
          }}
        ></div>
      </div>
      <div className="skill-level">{skill.level}%</div>
    </div>
  );
};

export default SkillCard;
