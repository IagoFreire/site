import type { ReactNode } from 'react';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

const SectionHeader = ({ icon, title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="section-header">
      <div className="section-icon">{icon}</div>
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
    </div>
  );
};

export default SectionHeader;
