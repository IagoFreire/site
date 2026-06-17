import { Mail, Briefcase, ChevronDown, Zap } from 'lucide-react';
import Button from '../components/Button';
import Aurora from '../components/ui/Aurora';
import BlurText from '../components/ui/BlurText';
import RotatingText from '../components/ui/RotatingText';
import ShinyText from '../components/ui/ShinyText';

interface HeroProps {
  isVisible: boolean;
  onNavigate: (section: string) => void;
}

const Hero = ({ isVisible, onNavigate }: HeroProps) => {
  return (
    <section id="home" className={`hero ${isVisible ? 'visible' : ''}`}>
      <div className="hero-background">
        <Aurora
          colorStops={['#6366f1', '#8b5cf6', '#ec4899']}
          speed={0.5}
          amplitude={1.2}
        />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <Zap size={16} />
          <ShinyText text="Disponível para novos projetos" speed={3} />
        </div>

        <h1 className="hero-title">
          Olá, eu sou{' '}
          <span className="gradient-text">
            <BlurText
              text="Iago Freire"
              delay={100}
              animateBy="words"
              direction="top"
            />
          </span>
        </h1>

        <p className="hero-subtitle">
          <RotatingText
            texts={['Frontend Developer', 'React Specialist', 'TypeScript Engineer']}
            mainClassName="rotating-text-main"
            staggerFrom="last"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-120%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            rotationInterval={3000}
          />
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
