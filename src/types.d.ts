export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  highlight: boolean;
  skills?: string[];
}

export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  github: string;
  stars?: number;
}
