import { Mail, Github, Linkedin } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ContactCard from '../components/ContactCard';
import Button from '../components/Button';

const Contact = () => {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionHeader 
          icon={<Mail />}
          title="Vamos Conversar?"
          subtitle="Estou sempre aberto a novas oportunidades"
        />
        
        <div className="contact-content">
          <div className="contact-cards">
            <ContactCard 
              icon={<Mail className="contact-icon" />}
              title="Email"
              value="iago_rocha@live.com"
              href="mailto:iago_rocha@live.com"
            />
            
            {/* <ContactCard 
              icon={<Phone className="contact-icon" />}
              title="Telefone"
              value="(19) 99153-5628"
              href="tel:+5519991535628"
            /> */}
            
            <ContactCard 
              icon={<Github className="contact-icon" />}
              title="GitHub"
              value="IagoFreire"
              href="https://github.com/IagoFreire"
            />
            
            <ContactCard 
              icon={<Linkedin className="contact-icon" />}
              title="LinkedIn"
              value="iagofreire"
              href="https://www.linkedin.com/in/iagofreire"
            />
          </div>
          
          <div className="cta-box">
            <h3>Pronto para começar um projeto?</h3>
            <p>
              Vamos criar algo incrível juntos! Entre em contato e vamos discutir 
              como posso ajudar a transformar suas ideias em realidade.
            </p>
            <Button 
              variant="primary"
              href="mailto:iago_rocha@live.com"
              icon={<Mail size={20} />}
            >
              Enviar Mensagem
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
