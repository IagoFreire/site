import { Github, ExternalLink, Star } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <div 
      className="project-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="project-header">
        <h3>{project.name}</h3>
        {project.stars && (
          <div className="project-stars">
            <Star size={16} fill="currentColor" />
            <span>{project.stars}</span>
          </div>
        )}
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-tech">
        {project.tech.map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
      </div>
      <a 
        href={project.github} 
        target="_blank" 
        rel="noopener noreferrer"
        className="project-link"
      >
        <Github size={18} />
        <span>Ver no GitHub</span>
        <ExternalLink size={14} />
      </a>
    </div>
  );
};

export default ProjectCard;
