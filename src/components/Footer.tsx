import { Terminal, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Terminal size={24} />
            <span>Iago Freire</span>
          </div>
          <p>Frontend Developer | ReactJS | React Native</p>
          <div className="footer-social">
            <a href="https://github.com/IagoFreire" target="_blank" rel="noopener noreferrer">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/iagofreire" target="_blank" rel="noopener noreferrer">
              <Linkedin size={20} />
            </a>
            <a href="mailto:iago_rocha@live.com">
              <Mail size={20} />
            </a>
          </div>
          <p className="footer-copy">
            &copy; 2026 Iago Freire. Feito com React + TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
