import type { Experience } from '../types';

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

const TimelineItem = ({ experience, index }: TimelineItemProps) => {
  return (
    <div 
      className={`timeline-item ${experience.highlight ? 'highlight' : ''}`}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="timeline-marker"></div>
      <div className="timeline-content">
        {experience.highlight && (
          <div className="current-badge">
            <span>Atual</span>
          </div>
        )}
        <h3>{experience.role}</h3>
        <h4>{experience.company}</h4>
        <p className="period">{experience.period}</p>
        <p className="description">{experience.description}</p>
      </div>
    </div>
  );
};

export default TimelineItem;
