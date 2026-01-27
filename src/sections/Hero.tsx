import { Mail, Briefcase, ChevronDown, Zap } from 'lucide-react';
import Button from '../components/Button';

interface HeroProps {
  isVisible: boolean;
  onNavigate: (section: string) => void;
}

const Hero = ({ isVisible, onNavigate }: HeroProps) => {
  return (
    <section id="home" className={`hero ${isVisible ? 'visible' : ''}`}>
      <div className="hero-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="hero-content">
        <div className="hero-badge">
          <Zap size={16} />
          <span>Disponível para novos projetos</span>
        </div>
        
        <h1 className="hero-title">
          Olá, eu sou <span className="gradient-text">Iago Freire</span>
        </h1>
        
        <p className="hero-subtitle">
          Frontend Developer | ReactJS | React Native
        </p>
        
        <p className="hero-description">
          Desenvolvedor apaixonado por criar experiências digitais incríveis e interfaces intuitivas.
          Especializado em React, TypeScript e desenvolvimento mobile.
        </p>
        
        <div className="hero-buttons">
          <Button 
            variant="primary" 
            onClick={() => onNavigate('contact')}
            icon={<Mail size={20} />}
          >
            Entre em Contato
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => onNavigate('experience')}
            icon={<Briefcase size={20} />}
          >
            Ver Experiência
          </Button>
        </div>
        
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">5+</div>
            <div className="stat-label">Anos de Experiência</div>
          </div>
          <div className="stat">
            <div className="stat-number">24+</div>
            <div className="stat-label">Repositórios GitHub</div>
          </div>
          <div className="stat">
            <div className="stat-number">3</div>
            <div className="stat-label">Empresas</div>
          </div>
        </div>
      </div>
      
      <button className="scroll-indicator" onClick={() => onNavigate('about')}>
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default Hero;
