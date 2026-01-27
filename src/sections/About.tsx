import { Code2, Rocket, Terminal, Zap, MapPin, GraduationCap } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const About = () => {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <SectionHeader 
          icon={<Code2 />}
          title="Sobre Mim"
          subtitle="Desenvolvedor Frontend em Limeira, São Paulo"
        />
        
        <div className="about-content">
          <div className="about-card">
            <Rocket className="about-icon" />
            <h3>Inovação</h3>
            <p>
              Crio soluções de software inovadoras e amigáveis aos usuários, sempre buscando 
              as melhores práticas e tecnologias modernas.
            </p>
          </div>
          
          <div className="about-card">
            <Terminal className="about-icon" />
            <h3>Experiência Técnica</h3>
            <p>
              Proficiente em ReactJS, React Native, TypeScript e JavaScript. Familiarizado 
              com Next.js, Flutter, Git e metodologias ágeis como Scrum.
            </p>
          </div>
          
          <div className="about-card">
            <Zap className="about-icon" />
            <h3>Cloud & DevOps</h3>
            <p>
              Experiência com serviços AWS como EC2, CodeCommit e RDS para implantações 
              em nuvem escaláveis e eficientes.
            </p>
          </div>
        </div>
        
        <div className="about-info">
          <div className="info-item">
            <MapPin size={20} />
            <span>Limeira, São Paulo, Brasil</span>
          </div>
          <div className="info-item">
            <GraduationCap size={20} />
            <span>Tecnólogo em Análise e Desenvolvimento de Sistemas</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
