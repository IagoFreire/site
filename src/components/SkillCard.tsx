import type { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
  index: number;
}

const SkillCard = ({ skill, index }: SkillCardProps) => {
  return (
    <div
      className="skill-pill"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <span className="skill-pill-icon">{skill.icon}</span>
      <span className="skill-pill-name">{skill.name}</span>
    </div>
  );
};

export default SkillCard;
