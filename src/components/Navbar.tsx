import { Terminal } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  scrollY: number;
  onNavigate: (section: string) => void;
}

const Navbar = ({ activeSection, scrollY, onNavigate }: NavbarProps) => {
  const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
  
  const getSectionLabel = (section: string) => {
    const labels: { [key: string]: string } = {
      home: 'Início',
      about: 'Sobre',
      experience: 'Experiência',
      skills: 'Habilidades',
      projects: 'Projetos',
      contact: 'Contato'
    };
    return labels[section] || section;
  };

  return (
    <nav className={`navbar ${scrollY > 50 ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <Terminal size={24} />
          <span>Iago.dev</span>
        </div>
        <div className="nav-links">
          {sections.map((section) => (
            <button
              key={section}
              className={activeSection === section ? 'active' : ''}
              onClick={() => onNavigate(section)}
            >
              {getSectionLabel(section)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
