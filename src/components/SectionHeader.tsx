import type { ReactNode } from 'react';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

const SectionHeader = ({ icon, title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="section-header">
      <div className="section-icon-badge">
        {icon}
      </div>
      <h2 className="section-title">
        <span className="section-title-text">{title}</span>
      </h2>
      <div className="section-title-accent" />
      <p className="section-subtitle">{subtitle}</p>
    </div>
  );
};

export default SectionHeader;
